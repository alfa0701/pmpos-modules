import CreateCard from './CreateCard';
import SetCardTag from './SetCardTag';
import CloseCard from './CloseCard';
import ExecuteCommand from './ExecuteCommand';
import SetState from './SetState';
import AskQuestion from './AskQuestion';
import SelectCard from './SelectCard';
import SetCardIndex from './SetCardIndex';
import CommitCard from './CommitCard';
import DisplayCard from './DisplayCard';

export default [
    new CreateCard(),
    new SetCardTag(),
    new CloseCard(),
    new CommitCard(),
    new DisplayCard(),
    new SetCardIndex(),
    new ExecuteCommand(),
    new SetState(),
    new AskQuestion(),
    new SelectCard()
];