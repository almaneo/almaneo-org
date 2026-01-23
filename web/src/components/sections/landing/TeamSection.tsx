import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';

interface TeamMember {
  id: string;
  avatar: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const teamMemberIds: TeamMember[] = [
  { id: 'alexKim', avatar: 'AK', socials: { twitter: '#', linkedin: '#' } },
  { id: 'sarahPark', avatar: 'SP', socials: { github: '#', linkedin: '#' } },
  { id: 'mikeChen', avatar: 'MC', socials: { twitter: '#', linkedin: '#' } },
  { id: 'yunaLee', avatar: 'YL', socials: { twitter: '#' } },
];

const advisorIds: TeamMember[] = [
  { id: 'jamesWong', avatar: 'JW' },
  { id: 'mariaSantos', avatar: 'MS' },
];

const roleKeys: Record<string, string> = {
  alexKim: 'founderCeo',
  sarahPark: 'cto',
  mikeChen: 'headOfProduct',
  yunaLee: 'headOfCommunity',
  jamesWong: 'aiEthicsAdvisor',
  mariaSantos: 'globalSouthAdvisor',
};

function MemberCard({ member }: { member: TeamMember }) {
  const { t } = useTranslation('landing');
  const roleKey = roleKeys[member.id];

  return (
    <GlassCard hover padding="lg" className="text-center group">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-neos-blue to-jeong-orange flex items-center justify-center text-2xl font-bold text-white">
        {member.avatar}
      </div>

      {/* Info */}
      <h4 className="text-lg font-bold mb-1">{t(`team.members.${member.id}.name`)}</h4>
      <p className="text-sm text-neos-blue mb-3">{t(`team.roles.${roleKey}`)}</p>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        {t(`team.members.${member.id}.description`)}
      </p>

      {/* Socials */}
      {member.socials && (
        <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {member.socials.github && (
            <a
              href={member.socials.github}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
        </div>
      )}
    </GlassCard>
  );
}

export function TeamSection() {
  const { t } = useTranslation('landing');

  return (
    <Section id="team">
      <Container>
        <SectionHeader
          tag={t('team.tag')}
          tagColor="warm"
          title={
            <>
              {t('team.titlePrefix')}<GradientText variant="warm">{t('team.titleHighlight')}</GradientText>{t('team.titleSuffix')}
            </>
          }
          subtitle={t('team.subtitle')}
        />

        {/* Core Team */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-text-secondary mb-6 text-center">
            {t('team.coreTeam')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMemberIds.map((member, i) => (
              <MemberCard key={i} member={member} />
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div>
          <h3 className="text-lg font-semibold text-text-secondary mb-6 text-center">
            {t('team.advisors')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {advisorIds.map((advisor, i) => (
              <MemberCard key={i} member={advisor} />
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div className="mt-12 text-center">
          <GlassCard padding="lg" className="inline-block">
            <p className="text-text-secondary mb-2">
              {t('team.joinCta')}
            </p>
            <p className="text-sm text-text-muted">
              <a href="mailto:team@almaneo.org" className="text-neos-blue hover:underline">
                team@almaneo.org
              </a>
              {' '}{t('team.contactMessage')}
            </p>
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}

export default TeamSection;
