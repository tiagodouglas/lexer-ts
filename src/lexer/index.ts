import Token from "./token";
import { TokenType } from "./tokenType";

export default class Lexer {
    private position: number;
    private readPosition: number;
    private ch: string;

    constructor(private input: string) {
        this.position = 0;
        this.readPosition = 0;
        this.ch = '';
        this.readChar();
    }

    public nextToken(): Token {
        let token = new Token("", "");

        this.skipWhiteSpace();

        switch (this.ch) {
            case '=':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    const literal = `${ch}${this.ch}`;
                    token = new Token(TokenType.EQ, literal);
                } else {
                    token = new Token(TokenType.ASSIGN, this.ch);
                }
                break;
            case '+':
                token = new Token(TokenType.PLUS, this.ch);
                break;
            case '-':
                token = new Token(TokenType.MINUS, this.ch);
                break;
            case '!':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    const literal = `${ch}${this.ch}`;
                    token = new Token(TokenType.NOT_EQ, literal);
                } else {
                    token = new Token(TokenType.BANG, this.ch);
                }
                break;
            case '/':
                token = new Token(TokenType.SLASH, this.ch);
                break;
            case '*':
                token = new Token(TokenType.ASTERISK, this.ch);
                break;
            case '<':
                token = new Token(TokenType.LT, this.ch);
                break;
            case '>':
                token = new Token(TokenType.GT, this.ch);
                break;
            case ';':
                token = new Token(TokenType.SEMICOLON, this.ch);
                break;
            case ',':
                token = new Token(TokenType.COMMA, this.ch);
                break;
            case '{':
                token = new Token(TokenType.LBRACE, this.ch);
                break;
            case '}':
                token = new Token(TokenType.RBRACE, this.ch);
                break;
            case '(':
                token = new Token(TokenType.LPAREN, this.ch);
                break;
            case ')':
                token = new Token(TokenType.RPAREN, this.ch);
                break;
            case '\0':
                token = new Token(TokenType.EOF, "");
                break;
            default:
                if (this.isLetter()) {
                    token.literal = this.readIdentifier();
                    token.type = this.lookupIdent(token.literal);
                    return token;
                } else if (this.isDigit()) {
                    token.literal = this.readNumber();
                    token.type = TokenType.INT;
                    return token;
                } else {
                    token = new Token(TokenType.ILLEGAL, this.ch);
                }
                break;
        }

        this.readChar();
        return token;
    }

    private readChar(): void {
        if (this.readPosition >= this.input.length) {
            this.ch = '\0';
        } else {
            this.ch = this.input[this.readPosition];
        }

        this.position = this.readPosition;
        this.readPosition++;
    }

    private peekChar(): string {
        if (this.readPosition >= this.input.length) {
            return '\0';
        } else {
            return this.input[this.readPosition];
        }
    }

    private skipWhiteSpace(): void {
        if (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r') {
            this.readChar();
        }
    }

    private readIdentifier(): string {
        const position = this.position;
        while (this.isLetter()) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }

    private readNumber(): string {
        const position = this.position;
        while (this.isDigit()) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }

    private isLetter(): boolean {
        return ('a' <= this.ch && this.ch <= 'z') || ('A' <= this.ch && this.ch <= 'Z') || this.ch === '_';
    }

    private isDigit(): boolean {
        return '0' <= this.ch && this.ch <= '9';
    }

    private lookupIdent(ident: string): string {
        const keywords: { [key: string]: string } = {
            fn: TokenType.FUNCTION,
            let: TokenType.LET,
            true: TokenType.TRUE,
            false: TokenType.FALSE,
            if: TokenType.IF,
            else: TokenType.ELSE,
            return: TokenType.RETURN,
        };

        const result = keywords[ident];

        return result ? result : TokenType.IDENT;
    }
}