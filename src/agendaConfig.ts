import Agenda from "agenda";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGODB_URI,'consoling from agendaConfig.ts');
const agenda = new Agenda({
    db:{
        address:process.env.MONGODB_URI || '',
        collection:'agendaJobs'
    }
});
agenda.defaultConcurrency(5);
agenda.maxConcurrency(20);

export default agenda;