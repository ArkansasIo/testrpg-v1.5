export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'claimed';
export interface QuestObjective { id: string; type: string; target: string; required: number; progress: number; }
export interface QuestData { id: string; title: string; description: string; objectives: QuestObjective[]; rewards: Record<string, number>; }
export interface QuestState extends QuestData { status: QuestStatus; }
