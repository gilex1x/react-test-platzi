import {describe, it, expect} from 'vitest';

describe('Primer conjunto de test',()=>{
    it('Suma de dos numeros',()=>{
        const suma = (a:number,b:number):number=>a+b;
        const resultado:number = suma(2,6);
        expect(resultado).toBe(8);
    });
    it('Dos textos iguales ',()=>{
        const texto1:string = 'PlatziConf';
        const texto2:string = 'PlatziConf';
        expect(texto1).toBe(texto2);
    });
    it('Un numero par',()=>{
        const minNumber:number = 1;
        const maxNumber:number =10;
        const randomNumber:number = Math.floor(Math.random()*(maxNumber - minNumber) + minNumber);
        console.log(randomNumber);
        const isOdd:number = randomNumber % 2;
        expect(isOdd).toBe(0);
    });
    it('Numero Mayor a',()=>{
        const minNumber:number = 1;
        const maxNumber:number =10;
        const randomNumber:number = Math.floor(Math.random()*(maxNumber - minNumber) + minNumber);
        console.log(randomNumber);
        expect(randomNumber).toBeGreaterThan(minNumber);
    })
})