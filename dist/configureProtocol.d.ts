import { Commit } from 'pmpos-models';
declare const _default: (terminalId: string, networkName: string, user: string, onConnect: (chatProtocol: any, commitProtocol: any, configProtocol: any) => void, onChatEvent: (messages: {
    time: number;
    message: string;
    user: string;
    id: string;
    lamport: number;
}[]) => void, onConfigEvent: (config: Map<string, any>) => void, onCommitEvent: (commits: Commit[]) => void) => void;
export default _default;
