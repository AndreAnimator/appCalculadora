import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  expressao : string = '0';
  calculado : boolean = false;
  visor : string = '0';
  operacao! : number;
  valor1! : number;
  valor2! : number;

  constructor() {}

  peek(): string {
    if(this.expressao[0] == undefined)
      return '\n';
    return this.expressao[0];
  }

  get(): string {
    let result = this.expressao[0];
    this.expressao = this.expressao.slice(1);
    return result;
  }

  number(): number {
    let result = this.get().charCodeAt(0) - '0'.charCodeAt(0);
    while (this.peek().charCodeAt(0) >= '0'.charCodeAt(0) && this.peek().charCodeAt(0) <= '9'.charCodeAt(0)) {
        result = 10 * result + this.get().charCodeAt(0) - '0'.charCodeAt(0);
    }
    return result;
  }

  factor(): number {
    if (this.peek().charCodeAt(0) >= '0'.charCodeAt(0) && this.peek().charCodeAt(0) <= '9'.charCodeAt(0))
      return this.number();
    else if (this.peek() == '(') {
      this.get(); // '('
      let result = this.expression();
      this.get(); // ')'
      return result;
    }
    else if (this.peek() == '-') {
        this.get();
        return -this.factor();
    }
    return 0; // error
  }

  term(): number {
    let result = this.factor();
    while (this.peek() == '*' || this.peek() == '/')
      if (this.get() == '*')
        result *= this.factor();
      else
        result /= this.factor();
    return result;
  }

  expression(): number {
    let result = this.term();
    while (this.peek() == '+' || this.peek() == '-')
      if (this.get() == '+')
        result += this.term();
      else
        result -= this.term();
    return result;
  }

  adicionarNumero(valor : string){
    if(this.visor == '0' || this.calculado){
      this.visor = valor;
      this.expressao = valor;
      this.calculado = false;
    }
    else{
      this.expressao += valor;
      this.visor += valor;
    }
  }

  adicionarOperacao(valor : number){
    this.operacao = valor;
    switch(this.operacao){
      case 0 : {
        this.expressao += '+';
        break;
      }
      case 1 : {
        this.expressao += '-';
        break;
      }
      case 2 : {
        this.expressao += '*';
        break;
      }
      case 3 : {
        this.expressao += '/';
        break;
      }
      case 4 : {
        this.expressao += '%';
        break;
      }
      case 5 : {
        break;
      }
      case 6 : {
        this.expressao = this.expressao.slice(0, -1);
        break;
      }
    }
    console.log("Expressao" + this.expressao);
    console.log("Visor" + this.visor);
  }

  calcular(){
    this.calculado = true;
    console.log("Expressao na hora de calcular " + this.expressao);
    console.log("Visor na hora de calcular " + this.visor);
    this.visor = String(this.expression());
    this.expressao = this.visor;
    console.log("Resultado final " + this.expressao);
    console.log("Resultado final do visor " + this.visor);
  }

  zerar(){
    this.expressao = '0';
    this.visor = '0';
  }
}
