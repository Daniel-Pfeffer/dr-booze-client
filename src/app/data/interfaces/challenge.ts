import {ChallengeParameter} from './challenge-parameter';

export interface Challenge {
    amount: number;
    params: Array<ChallengeParameter>;
    desc: string;
}
