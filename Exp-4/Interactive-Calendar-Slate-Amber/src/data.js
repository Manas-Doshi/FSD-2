export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CATEGORIES = {
  meeting: { label: 'Meeting', color: 'var(--cat-meeting)' },
  deadline: { label: 'Deadline', color: 'var(--cat-deadline)' },
  focus: { label: 'Focus block', color: 'var(--cat-focus)' },
  personal: { label: 'Personal', color: 'var(--cat-personal)' },
};

export const INITIAL_EVENTS = [
  { id: 'design-review', day: 'Mon', time: '10:00', title: 'Design review', category: 'meeting' },
  { id: 'ship-v23', day: 'Mon', time: '16:00', title: 'Ship v2.3', category: 'deadline' },
  { id: '1-1-sam', day: 'Tue', time: '09:30', title: '1:1 with Sam', category: 'meeting' },
  { id: 'write-proposal', day: 'Wed', time: '13:00', title: 'Write proposal', category: 'focus' },
  { id: 'sprint-planning', day: 'Thu', time: '11:00', title: 'Sprint planning', category: 'meeting' },
  { id: 'client-demo', day: 'Fri', time: '15:00', title: 'Client demo', category: 'meeting' },
  { id: 'grocery-run', day: 'Sat', time: '10:00', title: 'Grocery run', category: 'personal' },
  { id: 'portfolio-review', day: 'Sun', time: '18:00', title: 'Portfolio review', category: 'focus' },
];
