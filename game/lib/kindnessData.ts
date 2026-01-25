export interface KindnessScenario {
    id: string;
    culture: string;
    flag: string;
    value: string; // The specific cultural value (e.g., Jeong, Omotenashi)
    situation: string;
    options: {
        left: { text: string; isKind: boolean };
        right: { text: string; isKind: boolean };
    };
}

export const KINDNESS_SCENARIOS: KindnessScenario[] = [
    {
        id: 'kr-1',
        culture: 'Korea',
        flag: '🇰🇷',
        value: 'Jeong (정)',
        situation: '할머니가 무거운 짐을 들고 계단을 오르신다.',
        options: {
            left: { text: '모른 척 지나간다', isKind: false },
            right: { text: '짐을 들어드린다', isKind: true }
        }
    },
    {
        id: 'kr-2',
        culture: 'Korea',
        flag: '🇰🇷',
        value: 'Yeui (예의 - Dining Etiquette)',
        situation: '식사 자리에서 어르신이 아직 수저를 들지 않으셨다.',
        options: {
            left: { text: '기다린다', isKind: true },
            right: { text: '배고프니 먼저 먹는다', isKind: false }
        }
    },
    {
        id: 'jp-1',
        culture: 'Japan',
        flag: '🇯🇵',
        value: 'Omotenashi (배려)',
        situation: '비즈니스 미팅에서 명함을 받았다.',
        options: {
            left: { text: '두 손으로 받는다', isKind: true },
            right: { text: '한 손으로 받고 주머니에 넣는다', isKind: false }
        }
    },
    {
        id: 'us-1',
        culture: 'USA',
        flag: '🇺🇸',
        value: 'Small Talk (친근함)',
        situation: '엘리베이터에서 이웃과 눈이 마주쳤다.',
        options: {
            left: { text: '바닥을 본다', isKind: false },
            right: { text: '가볍게 미소짓고 인사한다', isKind: true }
        }
    },
    {
        id: 'in-1',
        culture: 'India',
        flag: '🇮🇳',
        value: 'Namaste (존중)',
        situation: '어른에게 인사를 한다.',
        options: {
            left: { text: '악수를 청한다', isKind: false },
            right: { text: '두 손을 모으고 고개를 숙인다', isKind: true }
        }
    },
    {
        id: 'th-1',
        culture: 'Thailand',
        flag: '🇹🇭',
        value: 'Wai (존경)',
        situation: '선생님을 만났다.',
        options: {
            left: { text: '합장하며 인사한다 (Wai)', isKind: true },
            right: { text: '손을 흔든다', isKind: false }
        }
    },
    {
        id: 'tr-1',
        culture: 'Turkey',
        flag: '🇹🇷',
        value: 'Hospitality (환대)',
        situation: '손님이 집에 방문했다.',
        options: {
            left: { text: '차(Tea)와 다과를 대접한다', isKind: true },
            right: { text: '용건만 묻는다', isKind: false }
        }
    },
    {
        id: 'za-1',
        culture: 'South Africa',
        flag: '🇿🇦',
        value: 'Ubuntu (공동체 정신)',
        situation: '동료가 도시락을 싸오지 못했다.',
        options: {
            left: { text: '내 음식을 나눈다', isKind: true },
            right: { text: '내 것만 먹는다', isKind: false }
        }
    },
    {
        id: 'fr-1',
        culture: 'France',
        flag: '🇫🇷',
        value: 'Respect (존중)',
        situation: '상점에 들어갔다.',
        options: {
            left: { text: '바로 물건을 찾는다', isKind: false },
            right: { text: '점원에게 "Bonjour"라고 인사한다', isKind: true }
        }
    },
    {
        id: 'cn-1',
        culture: 'China',
        flag: '🇨🇳',
        value: 'Guanxi (관계)',
        situation: '식사 계산서가 나왔다.',
        options: {
            left: { text: '서로 내겠다고 실랑이한다', isKind: true },
            right: { text: '정확히 더치페이한다', isKind: false }
        }
    }
];
