import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Twitter, UserPlus, Heart } from 'lucide-react';
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

// Co-Founders (실제 팀원)
const coFounders: TeamMember[] = [
  { id: 'rucaLee', avatar: 'RL', socials: { twitter: '#', linkedin: '#' } },
  { id: 'patrickMa', avatar: 'PM', socials: { twitter: '#', linkedin: '#' } },
  { id: 'lionKim', avatar: 'LK', socials: { twitter: '#', linkedin: '#' } },
];

// 모집 중인 역할들
const openRoles = [
  { id: 'cto', icon: '💻' },
  { id: 'headOfProduct', icon: '🎨' },
  { id: 'communityLead', icon: '🌍' },
  { id: 'aiResearcher', icon: '🤖' },
];

const roleKeys: Record<string, string> = {
  rucaLee: 'coFounder',
  patrickMa: 'coFounder',
  lionKim: 'coFounder',
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
      <p className="text-sm text-jeong-orange mb-3">{t(`team.roles.${roleKey}`)}</p>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        {t(`team.members.${member.id}.description`)}
      </p>

      {/* Socials */}
      {member.socials && (
        <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {member.socials.github && (
            <a
              href={member.socials.github}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
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

function OpenRoleCard({ roleId, icon }: { roleId: string; icon: string }) {
  const { t } = useTranslation('landing');

  return (
    <GlassCard
      hover
      padding="lg"
      className="text-center group border-dashed border-2 border-white/20 hover:border-jeong-orange/50"
    >
      {/* Icon */}
      <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-3xl group-hover:border-jeong-orange/30 transition-colors">
        {icon}
      </div>

      {/* Info */}
      <h4 className="text-lg font-bold mb-1 text-text-secondary group-hover:text-white transition-colors">
        {t(`team.openRoles.${roleId}.title`)}
      </h4>
      <p className="text-sm text-neos-blue mb-3">{t('team.hiring')}</p>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        {t(`team.openRoles.${roleId}.description`)}
      </p>

      {/* CTA */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1 text-xs text-jeong-orange opacity-0 group-hover:opacity-100 transition-opacity">
          <UserPlus className="w-3 h-3" />
          {t('team.applyNow')}
        </span>
      </div>
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

        {/* Co-Founders */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-text-secondary mb-6 text-center">
            {t('team.coFounders')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {coFounders.map((member, i) => (
              <MemberCard key={i} member={member} />
            ))}
          </div>
        </div>

        {/* Open Positions - Looking for Kind People */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-text-secondary mb-2 flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-jeong-orange" strokeWidth={1.5} />
              {t('team.lookingForKindPeople')}
            </h3>
            <p className="text-sm text-text-muted">
              {t('team.joinUsMessage')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {openRoles.map((role, i) => (
              <OpenRoleCard key={i} roleId={role.id} icon={role.icon} />
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
