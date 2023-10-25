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

    if (this.peek() == '.') {
      this.get(); // '.'
      let decimal = 0.1;
      while (this.peek().charCodeAt(0) >= '0'.charCodeAt(0) && this.peek().charCodeAt(0) <= '9'.charCodeAt(0)) {
        result += (this.get().charCodeAt(0) - '0'.charCodeAt(0)) * decimal;
        decimal /= 10;
      }
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
      if(valor == '.'){
        this.visor = "0.";
        this.expressao = "0.";
      }
      else{
        this.visor = valor;
        this.expressao = valor;
      }
      this.calculado = false;
    }
    else{
      this.expressao += valor;
      var posicao = 0;
      var count = 0;
      var numero = '';
      for(var i = this.expressao.length; i > 0; i--){
        console.log("hehe " + i + " " + this.expressao[i]);
        if((this.expressao[i] < '0' || this.expressao[i] > '9' ) && this.expressao[i] != '.' && count == 0){
          console.log("o que que passou pelo teste do if?? " + i + " char: " + this.expressao[i]);
          count++;
          posicao = i;
        }
      }
      count = 0;
      numero = this.expressao.slice(posicao, this.expressao.length);
      console.log("Quantas virgulas tem o numero " + numero + "? R: " + (numero.split(".").length - 1));
      if((numero.split(".").length - 1) > 1 && valor == '.'){
        console.log("Nuh-uh, não vai adicionar virgula");
        this.expressao = this.expressao.slice(0, -1);
      }
      else if((numero.split(".").length - 1) <= 1){
        console.log("Hum, tudo bem pode adicionar");
        this.visor += valor;
        console.log(this.visor + " += " + valor);
      }
    }
  }

  adicionarOperacao(valor : number){
    this.operacao = valor;
    switch(this.operacao){
      case 0 : {
        if(this.visor == '0' || this.calculado){
          this.visor = '+';
          this.expressao = '+';
          this.calculado = false;
        }
        else{
          if(this.expressao[this.expressao.length-1] != '*' && this.expressao[this.expressao.length-1] != '-' && this.expressao[this.expressao.length-1] != '/' && this.expressao[this.expressao.length-1] != '+'){
            this.expressao += '+';
            this.visor += '+';
          }else{
            this.expressao = this.expressao.slice(0, -1);
            this.visor = this.visor.slice(0, -1);
            this.expressao += '+';
            this.visor += '+';
          }
        }
        break;
      }
      case 1 : {
        if(this.visor == '0' || this.calculado){
          this.visor = '-';
          this.expressao = '-';
          this.calculado = false;
        }
        else{
          if(this.expressao[this.expressao.length-1] != '-' && this.expressao[this.expressao.length-1] != '+'){
            this.expressao += '-';
            this.visor += '-';
          }else if(this.expressao[this.expressao.length - 1] == '+'){
            this.expressao = this.expressao.slice(0, -1);
            this.visor = this.visor.slice(0, -1);
            this.expressao += '-';
            this.visor += '-';
          }
        }
        break;
      }
      case 2 : {
        if(this.expressao != '0' && !this.calculado){
          if(this.expressao[this.expressao.length-1] != '*' && this.expressao[this.expressao.length-1] != '-' && this.expressao[this.expressao.length-1] != '/' && this.expressao[this.expressao.length-1] != '+'){
            this.expressao += '*';
            this.visor += '*';
          }else{
            if(this.expressao.length > 1){
              this.expressao = this.expressao.slice(0, -1);
              this.visor = this.visor.slice(0, -1);
              this.expressao += '*';
              this.visor += '*';
            }
          }
        }
        break;
      }
      case 3 : {
        if(this.expressao != '0' && !this.calculado){
          if(this.expressao[this.expressao.length-1] != '*' && this.expressao[this.expressao.length-1] != '-' && this.expressao[this.expressao.length-1] != '/' && this.expressao[this.expressao.length-1] != '+' && this.expressao.length > 1){
            this.expressao += '/';
            this.visor += '/';
          }else{
            if(this.expressao.length > 1){
              this.expressao = this.expressao.slice(0, -1);
              this.visor = this.visor.slice(0, -1);
              this.expressao += '/';
              this.visor += '/';
            }
          }
        }
        break;
      }
      case 4 : {
        var count = 0;
        var pos;
        var char = '';
        if(this.expressao != '0' && !this.calculado){
          this.expressao += '%';
          this.visor += '%';
          for(var i = this.expressao.length; i > 0; i--){
            if(this.expressao[i] == '-' || this.expressao[i] == '+' || this.expressao[i] == '/' || this.expressao[i] == '*'){
              char = this.expressao[i];
              count++;
              if(count >= 1 && this.expressao[0] != '-' || this.expressao[0] != '+'){
                var porcentagem = this.expressao.slice(i+1, this.expressao.length);
                console.log("porcentagem expressaoooo " + porcentagem);
                this.expressao = this.expressao.slice(0, i);
                console.log("expressao antes de calcular " + this.expressao);
                this.expressao = String(this.expression());
                console.log("expressao calculada " + this.expressao);
                var calculo : number = Number(this.expressao) * Number(porcentagem.slice(0, -1)) / 100;
                console.log("Porcentagem calculada " + calculo);
                this.expressao = this.expressao + char + calculo;
                console.log("Expressao pro calculo final " + this.expressao);
                this.expressao = String(this.expression());
                console.log("Calculo final");
              }
              pos = i;
            }
          }
          if(count == 1 && this.expressao[0] == '-' || count == 0){
            let porcentagem : number = Number(this.expressao.slice(0, -1))/100;
            this.expressao = char + String(porcentagem);
            console.log("Porcentagem individual: " + porcentagem + " sinal " + char);
          }
        }
        break;
      }
      case 5 : {
        if(this.expressao.length >= 3){
          var aux = this.expressao.length;
          console.log(" " + this.expressao[aux-1] + this.expressao[aux-2] + this.expressao[aux-3] + " duh");
          if(this.expressao[aux-1] == '1' && this.expressao[aux-2] == '-' && this.expressao[aux-3] == '*'){
            this.expressao = this.expressao.slice(0, this.expressao.length - 3);
            this.visor = this.visor.slice(0, this.visor.length - 3);
          }
          else{
            this.expressao += "*-1";
            this.visor += "*-1";
          }
        }
        else if(this.expressao != '0' && !this.calculado){
          this.expressao += "*-1";
          this.visor += "*-1";
        }
        break;
      }
      case 6 : {
        if(this.expressao.length == 1)
          this.zerar();
        else{
          this.expressao = this.expressao.slice(0, -1);
          this.visor = this.visor.slice(0, -1);
        }
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
    if(this.expressao == 'Infinity'){
      this.expressao = 'Erro matemático';
      this.visor = 'Erro matemático';
    }
  }

  zerar(){
    this.expressao = '0';
    this.visor = '0';
  }
}
