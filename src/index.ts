import * as dotenv from 'dotenv';
dotenv.config();

if(!process.env.PORT){
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
console.log(`Listening on port ${PORT}`);