import agendaDefault from "agenda";
import dotenv from "dotenv";
dotenv.config();

const AgendaConstructor = typeof agendaDefault === "function" 
  ? agendaDefault 
  : (agendaDefault as any).Agenda || ((agendaDefault as any).default as any);

console.log(process.env.MONGODB_URI,'consoling from agendaConfig.ts');
const agenda = new AgendaConstructor({
    db: {
        address: process.env.MONGODB_URI || '',
        collection: 'agendaJobs'
    }
});
agenda.defaultConcurrency(5);
agenda.maxConcurrency(20);

export default agenda;