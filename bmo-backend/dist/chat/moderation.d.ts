export interface ModerationResult {
    blocked: boolean;
    reason?: string;
    flaggedWord?: string;
}
export declare function moderateMessage(content: string): ModerationResult;
