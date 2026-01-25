/**
 * useGovernance Hook
 * AlmaNEO Governor 컨트랙트 연동 (ALMAN)
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract, formatUnits, keccak256, toUtf8Bytes } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import { ALMANGovernorABI, ALMANTokenABI, ProposalState, PROPOSAL_STATE_NAMES, VoteSupport } from '../contracts/abis';

export interface Proposal {
  id: string;
  proposer: string;
  state: ProposalState;
  stateName: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  deadline: Date | null;
  snapshot: number;
  hasVoted: boolean;
  description: string;
}

export interface GovernanceStats {
  votingDelay: number; // seconds
  votingPeriod: number; // seconds
  proposalThreshold: string; // ALMAN
  quorum: string; // ALMAN
}

export interface VotingPower {
  votes: string;
  delegated: string;
}

export function useGovernance() {
  const { provider, address, isConnected } = useWallet();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null);
  const [governanceStats, setGovernanceStats] = useState<GovernanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposalsLoading, setProposalsLoading] = useState(false);

  // 컨트랙트 배포 여부
  const isDeployed = isContractDeployed('ALMANGovernor');
  const governorAddress = getContractAddress('ALMANGovernor');
  const tokenAddress = getContractAddress('ALMANToken');

  // 컨트랙트 인스턴스 가져오기
  const getContracts = useCallback(() => {
    if (!provider || !isDeployed) return null;

    const governorContract = new Contract(governorAddress, ALMANGovernorABI, provider);
    const tokenContract = new Contract(tokenAddress, ALMANTokenABI, provider);

    return { governorContract, tokenContract, provider };
  }, [provider, isDeployed, governorAddress, tokenAddress]);

  // 거버넌스 통계 로드
  const loadGovernanceStats = useCallback(async () => {
    if (!isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      const [votingDelay, votingPeriod, proposalThreshold] = await Promise.all([
        contracts.governorContract.votingDelay(),
        contracts.governorContract.votingPeriod(),
        contracts.governorContract.proposalThreshold(),
      ]);

      // quorum은 block number가 필요하므로 현재 블록 사용
      const currentBlock = await contracts.provider.getBlockNumber();
      let quorum = '0';
      try {
        const quorumValue = await contracts.governorContract.quorum(currentBlock - 1);
        quorum = formatUnits(quorumValue, 18);
      } catch {
        // quorum 조회 실패 시 기본값 사용
      }

      setGovernanceStats({
        votingDelay: Number(votingDelay),
        votingPeriod: Number(votingPeriod),
        proposalThreshold: formatUnits(proposalThreshold, 18),
        quorum,
      });
    } catch (err) {
      console.error('Failed to load governance stats:', err);
    }
  }, [isDeployed, getContracts]);

  // 투표권 로드
  const loadVotingPower = useCallback(async () => {
    if (!address || !isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      const [votes, delegatee] = await Promise.all([
        contracts.tokenContract.getVotes(address),
        contracts.tokenContract.delegates(address),
      ]);

      setVotingPower({
        votes: formatUnits(votes, 18),
        delegated: delegatee,
      });
    } catch (err) {
      console.error('Failed to load voting power:', err);
    }
  }, [address, isDeployed, getContracts]);

  // 제안 상세 정보 로드
  const loadProposalDetails = useCallback(async (proposalId: string, description: string = '') => {
    if (!isDeployed) return null;

    const contracts = getContracts();
    if (!contracts) return null;

    try {
      const [state, votes, deadline, snapshot, proposer] = await Promise.all([
        contracts.governorContract.state(proposalId),
        contracts.governorContract.proposalVotes(proposalId),
        contracts.governorContract.proposalDeadline(proposalId),
        contracts.governorContract.proposalSnapshot(proposalId),
        contracts.governorContract.proposalProposer(proposalId),
      ]);

      let hasVoted = false;
      if (address) {
        hasVoted = await contracts.governorContract.hasVoted(proposalId, address);
      }

      const proposal: Proposal = {
        id: proposalId,
        proposer,
        state: Number(state) as ProposalState,
        stateName: PROPOSAL_STATE_NAMES[Number(state)],
        forVotes: formatUnits(votes[1], 18),
        againstVotes: formatUnits(votes[0], 18),
        abstainVotes: formatUnits(votes[2], 18),
        deadline: Number(deadline) > 0 ? new Date(Number(deadline) * 1000) : null,
        snapshot: Number(snapshot),
        hasVoted,
        description,
      };

      return proposal;
    } catch (err) {
      console.error('Failed to load proposal details:', err);
      return null;
    }
  }, [address, isDeployed, getContracts]);

  // 제안 목록 로드 (ProposalCreated 이벤트 조회)
  const loadProposals = useCallback(async () => {
    if (!isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      setProposalsLoading(true);

      // ProposalCreated 이벤트 필터 생성
      const filter = contracts.governorContract.filters.ProposalCreated();

      // 최근 10000 블록에서 이벤트 조회 (약 5-6시간)
      // Polygon Amoy는 블록 시간이 약 2초
      const currentBlock = await contracts.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 100000); // 더 넓은 범위로 조회

      const events = await contracts.governorContract.queryFilter(filter, fromBlock, currentBlock);

      // 이벤트에서 제안 정보 추출 및 상세 정보 로드
      const proposalPromises = events.map(async (event) => {
        const args = (event as unknown as { args: [bigint, string, string[], bigint[], string[], string[], bigint, bigint, string] }).args;
        const [proposalId, , , , , , , , description] = args;

        // 제안 상세 정보 로드
        const proposal = await loadProposalDetails(proposalId.toString(), description);
        return proposal;
      });

      const loadedProposals = await Promise.all(proposalPromises);

      // null 제거 및 최신순 정렬
      const validProposals = loadedProposals
        .filter((p): p is Proposal => p !== null)
        .sort((a, b) => {
          // deadline이 있으면 deadline 기준, 없으면 id 기준
          if (a.deadline && b.deadline) {
            return b.deadline.getTime() - a.deadline.getTime();
          }
          return BigInt(b.id) > BigInt(a.id) ? 1 : -1;
        });

      setProposals(validProposals);
    } catch (err) {
      console.error('Failed to load proposals:', err);
      setError('Failed to load proposals');
    } finally {
      setProposalsLoading(false);
    }
  }, [isDeployed, getContracts, loadProposalDetails]);

  // 투표 실행
  const castVote = useCallback(async (proposalId: string, support: VoteSupport, reason?: string) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const governorWithSigner = contracts.governorContract.connect(signer) as Contract;

      let tx;
      if (reason) {
        tx = await governorWithSigner.castVoteWithReason(proposalId, support, reason);
      } else {
        tx = await governorWithSigner.castVote(proposalId, support);
      }
      await tx.wait();

      return true;
    } catch (err: unknown) {
      console.error('Vote failed:', err);
      setError(err instanceof Error ? err.message : 'Voting failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts]);

  // 위임
  const delegate = useCallback(async (delegatee: string) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const tokenWithSigner = contracts.tokenContract.connect(signer) as Contract;

      const tx = await tokenWithSigner.delegate(delegatee);
      await tx.wait();

      await loadVotingPower();
      return true;
    } catch (err: unknown) {
      console.error('Delegate failed:', err);
      setError(err instanceof Error ? err.message : 'Delegation failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts, loadVotingPower]);

  // 자기 위임 (투표권 활성화)
  const selfDelegate = useCallback(async () => {
    if (!address) return false;
    return delegate(address);
  }, [address, delegate]);

  // 제안 생성
  const createProposal = useCallback(async (
    targets: string[],
    values: bigint[],
    calldatas: string[],
    description: string
  ) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return null;
    }

    const contracts = getContracts();
    if (!contracts) return null;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const governorWithSigner = contracts.governorContract.connect(signer) as Contract;

      const tx = await governorWithSigner.propose(targets, values, calldatas, description);
      const receipt = await tx.wait();

      // ProposalCreated 이벤트에서 proposalId 추출
      const event = receipt.logs.find((log: { fragment?: { name: string } }) =>
        log.fragment?.name === 'ProposalCreated'
      );

      if (event && 'args' in event) {
        return event.args[0].toString();
      }

      return null;
    } catch (err: unknown) {
      console.error('Propose failed:', err);
      setError(err instanceof Error ? err.message : 'Proposal creation failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts]);

  // 제안 큐잉
  const queueProposal = useCallback(async (
    targets: string[],
    values: bigint[],
    calldatas: string[],
    description: string
  ) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const governorWithSigner = contracts.governorContract.connect(signer) as Contract;

      const descriptionHash = keccak256(toUtf8Bytes(description));
      const tx = await governorWithSigner.queue(targets, values, calldatas, descriptionHash);
      await tx.wait();

      return true;
    } catch (err: unknown) {
      console.error('Queue failed:', err);
      setError(err instanceof Error ? err.message : 'Queue failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts]);

  // 제안 실행
  const executeProposal = useCallback(async (
    targets: string[],
    values: bigint[],
    calldatas: string[],
    description: string
  ) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const governorWithSigner = contracts.governorContract.connect(signer) as Contract;

      const descriptionHash = keccak256(toUtf8Bytes(description));
      const tx = await governorWithSigner.execute(targets, values, calldatas, descriptionHash);
      await tx.wait();

      return true;
    } catch (err: unknown) {
      console.error('Execute failed:', err);
      setError(err instanceof Error ? err.message : 'Execution failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts]);

  // 모든 데이터 새로고침
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      loadGovernanceStats(),
      loadVotingPower(),
      loadProposals(),
    ]);
    setIsLoading(false);
  }, [loadGovernanceStats, loadVotingPower, loadProposals]);

  // 초기 로드
  useEffect(() => {
    if (isConnected && provider && isDeployed) {
      refresh();
    }
  }, [isConnected, provider, isDeployed, refresh]);

  return {
    // State
    proposals,
    votingPower,
    governanceStats,
    isLoading,
    proposalsLoading,
    error,
    isDeployed,

    // Actions
    loadProposalDetails,
    loadProposals,
    castVote,
    delegate,
    selfDelegate,
    createProposal,
    queueProposal,
    executeProposal,
    refresh,
  };
}
