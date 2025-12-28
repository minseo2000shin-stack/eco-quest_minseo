import type { Story, Quest } from './types';

export const STORIES: Story[] = [
  {
    id: 's1',
    text: '화창한 날씨에 밖으로 나왔습니다. 길가에 버려진 쓰레기가 보이네요.',
    choices: [
      { label: '주변 쓰레기를 줍는다', tag: 'outdoor' },
      { label: '분리수거함을 찾아본다', tag: 'outdoor' }
    ]
  },
  {
    id: 's2',
    text: '집에서 쉬는 동안 에너지를 아낄 방법을 찾았습니다.',
    choices: [
      { label: '가전제품 코드 뽑기', tag: 'home' },
      { label: '메일함 정리하기', tag: 'home' }
    ]
  },
  {
    id: 's3',
    text: '학교 복도를 지나가다 아무도 없는 빈 교실을 발견했습니다.',
    choices: [
      { label: '교실 불을 끈다', tag: 'school' },
      { label: '텀블러를 챙겨간다', tag: 'school' }
    ]
  }
];

export const QUESTS: Quest[] = [
  {
    id: 'q1',
    title: '플로깅 실천하기',
    desc: '눈에 띄는 쓰레기 3개를 주워 올바르게 버려주세요.',
    tag: 'outdoor'
  },
  {
    id: 'q2',
    title: '디지털 탄소 줄이기',
    desc: '불필요한 이메일 10개를 삭제하여 서버 에너지를 아껴주세요.',
    tag: 'home'
  },
  {
    id: 'q3',
    title: '빈 교실 소등',
    desc: '아무도 없는 교실의 전등을 꺼서 전기를 절약해주세요.',
    tag: 'school'
  },
  {
    id: 'q4',
    title: '텀블러 사용하기',
    desc: '일회용 컵 대신 개인 텀블러를 사용하여 플라스틱을 줄여주세요.',
    tag: 'school'
  },
  {
    id: 'q5',
    title: '에너지 절약',
    desc: '사용하지 않는 가전제품의 플러그를 뽑아 대기 전력을 차단해주세요.',
    tag: 'home'
  }
];
