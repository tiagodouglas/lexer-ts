import * as readline from 'readline';
import Lexer from './lexer';
import Token from './lexer/token';
import { TokenType } from './lexer/tokenType';

(() => {
    console.log("Lexer made in typescript");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.setPrompt('>> ');
    rl.prompt();

    rl.on('line', (line: string) => {
        if (line.trim() === 'exit') {
            rl.close();
            return;
        }

        const lexer = new Lexer(line);

        let tok: Token;
        do {
            tok = lexer.nextToken();
            console.log(tok.type);
        } while (tok.type !== TokenType.EOF);

        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Later bitch');
        process.exit(0);
    });
}
)();