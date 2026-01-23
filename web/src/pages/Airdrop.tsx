/**
 * Airdrop Page - 에어드롭 클레임
 * 작업 기반 에어드롭 (Task-Based Airdrop)
 */

import { Gift, CheckCircle, Clock, Users, MessageSquare, GraduationCap, Heart } from 'lucide-react';

// 에어드롭 태스크 카테고리
const taskCategories = [
  {
    id: 'dao',
    name: 'DAO Participation',
    icon: Users,
    color: 'text-neos-blue',
    bgColor: 'bg-neos-blue/20',
    tasks: [
      { id: 1, title: 'Vote on 3 Proposals', reward: 500, completed: true },
      { id: 2, title: 'Delegate Voting Power', reward: 200, completed: false },
      { id: 3, title: 'Create a Proposal', reward: 1000, completed: false },
    ],
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: MessageSquare,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    tasks: [
      { id: 4, title: 'Follow @ALMAN on X', reward: 100, completed: true },
      { id: 5, title: 'Join Discord Server', reward: 100, completed: true },
      { id: 6, title: 'Share ALMAN Post', reward: 150, completed: false },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    tasks: [
      { id: 7, title: 'Complete AI Basics Quiz', reward: 300, completed: false },
      { id: 8, title: 'Watch GAII Tutorial', reward: 200, completed: false },
      { id: 9, title: 'Read Whitepaper', reward: 250, completed: true },
    ],
  },
  {
    id: 'kindness',
    name: 'Kindness Activities',
    icon: Heart,
    color: 'text-jeong-orange',
    bgColor: 'bg-jeong-orange/20',
    tasks: [
      { id: 10, title: 'Help 3 Community Members', reward: 400, completed: false },
      { id: 11, title: 'Translate Content', reward: 500, completed: false },
      { id: 12, title: 'Mentor a New User', reward: 600, completed: false },
    ],
  },
];

export default function Airdrop() {
  // TODO: Web3 연동 후 실제 데이터로 교체
  const mockData = {
    totalEarned: 1150,
    totalClaimed: 700,
    pendingClaim: 450,
    completedTasks: 4,
    totalTasks: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Airdrop</h1>
          <p className="text-slate-400">
            Complete tasks to earn ALMAN tokens
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-neos-blue/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-neos-blue" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-white">{mockData.totalEarned} ALMAN</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Claimed</p>
            <p className="text-2xl font-bold text-white">{mockData.totalClaimed} ALMAN</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-jeong-orange/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-jeong-orange" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Pending Claim</p>
            <p className="text-2xl font-bold text-white">{mockData.pendingClaim} ALMAN</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Tasks Completed</p>
            <p className="text-2xl font-bold text-white">{mockData.completedTasks} / {mockData.totalTasks}</p>
          </div>
        </div>

        {/* Claim Button */}
        {mockData.pendingClaim > 0 && (
          <div className="card p-6 mb-10 bg-gradient-to-r from-neos-blue/10 to-jeong-orange/10 border-neos-blue/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Ready to Claim!</h3>
                <p className="text-slate-400">
                  You have <span className="text-jeong-orange font-semibold">{mockData.pendingClaim} ALMAN</span> ready to claim
                </p>
              </div>
              <button className="btn-primary px-8 py-3 text-lg">
                Claim All
              </button>
            </div>
          </div>
        )}

        {/* Task Categories */}
        <div className="space-y-8">
          {taskCategories.map((category) => {
            const Icon = category.icon;
            const completedCount = category.tasks.filter(t => t.completed).length;

            return (
              <div key={category.id} className="card p-6">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {completedCount} / {category.tasks.length} completed
                      </p>
                    </div>
                  </div>
                  {/* Progress */}
                  <div className="w-32">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${category.bgColor.replace('/20', '')}`}
                        style={{ width: `${(completedCount / category.tasks.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {category.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        task.completed
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-slate-800/50 border border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                        )}
                        <span className={task.completed ? 'text-slate-400 line-through' : 'text-white'}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${task.completed ? 'text-green-400' : 'text-jeong-orange'}`}>
                          +{task.reward} ALMAN
                        </span>
                        {!task.completed && (
                          <button className="px-4 py-1.5 bg-neos-blue/20 text-neos-blue rounded-lg hover:bg-neos-blue/30 transition-colors text-sm">
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
