const Jimp = require('jimp');
const readline = require('readline');
const { createCanvas } = require('canvas');
const fs = require('fs');

// Tamanho da imagem
const width = 1280;
const height = 720;

// Dimensões do mockup do livro
const baseImageWidth = 420;
const baseImageHeight = 472;

// Tamanho da terceira imagem
const topImageWidth = 392;
const topImageHeight = 392;

// Caminho da imagem de base (mockup do livro)
const baseImagePath = './images/livromokup.png';

// Caminho da imagem de sobreposição
const overlayImagePath = './images/bigLogo.png';

// Caminho da terceira imagem (a ser colocada por cima de tudo)
const topImagePath = './images/logo.png';

// Caminho dos textos gerados pelo Código
const titleImagePath = './images/generated/titulo.png'
const diaImagePath = './images/generated/dia.png'
const capituloImagePath = './images/generated/capitulo.png'

// Declarando o readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Nome do arquivo: ", (arquivoName) => {

    rl.question('Código hexadecimal da cor: ', (answer) => {

        rl.question("Titulo na thumb: ", (title) => {
    
            rl.question("Dia da semana: ", (dia) => {
    
                rl.question("Número do Capítulo: ", (capitulo) => {
    
                    // Criando o TITULO para posteriormente adicionar a imagem
                    // Criar um novo canvas usando node-canvas
                    const canvasTitulo = createCanvas(1280, 720);
                    const ctxTitulo = canvasTitulo.getContext('2d');
                    
                    // Definir a fonte e cor do texto
                    ctxTitulo.font = 'bold 53px Poppins';
                    ctxTitulo.fillStyle = 'white';
                    ctxTitulo.textAlign = 'right';
                    
                    // Desenhar o texto no canvas
                    ctxTitulo.fillText(title, 1250, 150);
                    
                    // Converter o canvas para um buffer PNG
                    const bufferTitulo = canvasTitulo.toBuffer('image/png');
                    
                    // Salvar a imagem no diretório
                    fs.writeFileSync('./images/generated/titulo.png', bufferTitulo);
                    console.log('Imagem criada e salva com sucesso!');
    
    
                    // Criando o DIA para posteriormente adicionar a imagem
                    // Criar um novo canvas usando node-canvas
                    const canvasDia = createCanvas(1280, 720);
                    const ctxDia = canvasDia.getContext('2d');
    
                    // Definir a fonte e cor do texto
                    ctxDia.font = 'italic 300 53px Poppins';
                    ctxDia.fillStyle = 'white';
                    ctxDia.textAlign = 'right';
    
                    // Desenhar o texto no canvas
                    ctxDia.fillText(dia, 1250, 210);
    
                    // Converter o canvas para um buffer PNG
                    const bufferDia = canvasDia.toBuffer('image/png');
    
                    // Salvar a imagem no diretório
                    fs.writeFileSync('./images/generated/dia.png', bufferDia);
                    console.log('Imagem criada e salva com sucesso!');
    
    
                    // Criando o Capitulo para posteriormente adicionar a imagem
                    // Criar um novo canvas usando node-canvas
                    const canvasCap = createCanvas(1280, 720);
                    const ctxCap = canvasCap.getContext('2d');
    
                    // Definir a fonte e cor do texto
                    ctxCap.font = 'italic 300 53px Poppins';
                    ctxCap.fillStyle = 'white';
                    ctxCap.textAlign = 'right';
    
                    // Desenhar o texto no canvas
                    ctxCap.fillText(`Capítulo ${capitulo}`, 1250, 270);
    
                    // Converter o canvas para um buffer PNG
                    const bufferCap = canvasCap.toBuffer('image/png');
    
                    // Salvar a imagem no diretório
                    fs.writeFileSync('./images/generated/capitulo.png', bufferCap);
                    console.log('Imagem criada e salva com sucesso!');
    
    
                    // Cor em formato hexadecimal
                    const colorHex = answer;
                    
                    // Criar uma nova imagem sólida
                    new Jimp(width, height, colorHex, (err, image) => {
                        if (err) throw err;
                    
                        // Carregar a imagem de sobreposição
                        Jimp.read(overlayImagePath)
                            .then(overlayImage => {
                                // Calcular a posição para centralizar a imagem de sobreposição
                                const x = -475;
                                const y = ((height - overlayImage.bitmap.height) / 2 ) + 10;
                    
                                // Ajustar a opacidade da imagem de sobreposição
                                overlayImage.opacity(0.2);
                    
                                // Sobrepor a imagem de sobreposição na imagem sólida
                                image.composite(overlayImage, x, y);
                    
                                // Carregar a terceira imagem (a ser colocada por cima de tudo)
                                Jimp.read(topImagePath)
                                .then(topImage => {
                                    // Redimensionar a terceira imagem para o tamanho desejado
                                    topImage.resize(topImageWidth, topImageHeight);
                    
                                    // Calcular a posição para a terceira imagem (centro da imagem final)
                                    const topX = 0;
                                    const topY = (height - topImageHeight) / 2;
                    
                                    // Sobrepor a terceira imagem por cima de tudo
                                    image.composite(topImage, topX, topY);
                    
                                    // Carregar a imagem de base (mockup do livro)
                                    Jimp.read(baseImagePath)
                                    .then(baseImage => {
                                        // Redimensionar o mockup do livro para as dimensões desejadas
                                        baseImage.resize(baseImageWidth, baseImageHeight);
    
                                        // Sobrepor o mockup do livro como base
                                        image.composite(baseImage, 840, 455);
    
                                        Jimp.read(titleImagePath)
                                        .then(titleImage => {
                                            image.composite(titleImage, 0, 0);
    
                                            Jimp.read(diaImagePath)
                                            .then(diaImage => {
                                                image.composite(diaImage, 0, 0);
    
                                                Jimp.read(capituloImagePath)
                                                .then(capituloImage => {
                                                    image.composite(capituloImage, 0, 0);
    
                                                    // Caminho para salvar a imagem
                                                    const outputPath = `./out/${arquivoName}.png`;
    
                                                    // Salvar a imagem final
                                                    image.write(outputPath, (err) => {
                                                        if (err) throw err;
                                                        console.log('Imagem final criada com sucesso!');
                                                    });
                                                })
                                                .catch(err => {
                                                    console.error('Erro ao carregar imagem do Capitulo:', err);
                                                });
                                            })
                                            .catch(err => {
                                                console.error('Erro ao carregar imagem do Dia:', err);
                                            });
                                        })
                                        .catch(err => {
                                            console.error('Erro ao carregar imagem do Titulo:', err);
                                        });
                                    })
                                    .catch(err => {
                                        console.error('Erro ao carregar imagem de base (mockup do livro):', err);
                                    });
                                })
                                .catch(err => {
                                    console.error('Erro ao carregar terceira imagem:', err);
                                });
                            })
                            .catch(err => {
                                console.error('Erro ao carregar imagem de sobreposição:', err);
                            });
                    });
                    rl.close();
                });
            }); 
        });
    });
});