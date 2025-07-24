const express = require('express');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Carrega as coordenadas do arquivo JSON
const coordinates = require('./coordenadas.json');

app.post('/gerar-pdf', async (req, res) => {
  const data = req.body;

  try {
    const existingPdfBytes = fs.readFileSync(path.join(__dirname, 'modelo/nota.pdf'));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawTextAtCoordinate = (page, text, coordName) => {
      const coord = coordinates[coordName];
      if (coord && text) {
        page.drawText(text.toString(), {
          x: coord.x,
          y: page.getHeight() - coord.y - coord.height,
          font,
          size: coord.height * 0.7,
          color: rgb(0, 0, 0),
        });
      }
    };

    const drawXAtCoordinate = (page, coordName) => {
      const coord = coordinates[coordName];
      if (coord) {
        page.drawText('X', {
          x: coord.x,
          y: page.getHeight() - coord.y - coord.height,
          font,
          size: coord.height * 0.9,
          color: rgb(0, 0, 0),
        });
      }
    };

    // Preenchimentos (mantidos conforme seu código)

    drawTextAtCoordinate(firstPage, data.cliente, 'Cliente');
    drawTextAtCoordinate(firstPage, data.cpf, 'CPF');
    drawTextAtCoordinate(firstPage, data.paciente, 'Paciente');
    drawTextAtCoordinate(firstPage, data.bairro, 'Bairro');
    drawTextAtCoordinate(firstPage, data.endereco, 'Endereço');
    drawTextAtCoordinate(firstPage, data.cidade, 'Cidade');
    drawTextAtCoordinate(firstPage, data.estado, 'Est');

    drawTextAtCoordinate(firstPage, data["numero-ficha"], 'numero-ficha');
    drawTextAtCoordinate(firstPage, data["numero-ficha"], 'numero-ficha_2');

    function formatarDataBrasileira(dataISO) {
      if (!dataISO) return '';
      const [ano, mes, dia] = dataISO.split('-');
      return `${dia}/${mes}/${ano}`;
    }

    drawTextAtCoordinate(firstPage, formatarDataBrasileira(data.dataCompra), 'Data Compra');
    drawTextAtCoordinate(firstPage, formatarDataBrasileira(data.prevEntrega), 'Prev. Entrega');

    const nomeMedico = data.novo_medico?.trim() || data.medico?.trim() || '';
    drawTextAtCoordinate(firstPage, nomeMedico, 'Médico');

    // Campos LONGE
    drawTextAtCoordinate(firstPage, data.longe_od_esferico, 'Longe_OD_Esferico');
    drawTextAtCoordinate(firstPage, data.longe_od_cilindrico, 'Longe_OD_Cilindrico');
    drawTextAtCoordinate(firstPage, data.longe_od_eixo, 'Longe_OD_Eixo');
    drawTextAtCoordinate(firstPage, data.longe_od_dnp_altura, 'Longe_OD_DNP_Altura');
    drawTextAtCoordinate(firstPage, data.longe_od_adicao, 'Longe_OD_Adicao');

    drawTextAtCoordinate(firstPage, data.longe_oe_esferico, 'Longe_OE_Esferico');
    drawTextAtCoordinate(firstPage, data.longe_oe_cilindrico, 'Longe_OE_Cilindrico');
    drawTextAtCoordinate(firstPage, data.longe_oe_eixo, 'Longe_OE_Eixo');
    drawTextAtCoordinate(firstPage, data.longe_oe_dnp_altura, 'Longe_OE_DNP_Altura');
    drawTextAtCoordinate(firstPage, data.longe_oe_adicao, 'Longe_OE_Adicao');

    // Campos PERTO
    drawTextAtCoordinate(firstPage, data.perto_od_esferico, 'Perto_OD_Esferico');
    drawTextAtCoordinate(firstPage, data.perto_od_cilindrico, 'Perto_OD_Cilindrico');
    drawTextAtCoordinate(firstPage, data.perto_od_eixo, 'Perto_OD_Eixo');
    drawTextAtCoordinate(firstPage, data.perto_od_dnp_altura, 'Perto_OD_DNP_Altura');
    drawTextAtCoordinate(firstPage, data.perto_od_adicao, 'Perto_OD_Adicao');

    drawTextAtCoordinate(firstPage, data.perto_oe_esferico, 'Perto_OE_Esferico');
    drawTextAtCoordinate(firstPage, data.perto_oe_cilindrico, 'Perto_OE_Cilindrico');
    drawTextAtCoordinate(firstPage, data.perto_oe_eixo, 'Perto_OE_Eixo');
    drawTextAtCoordinate(firstPage, data.perto_oe_dnp_altura, 'Perto_OE_DNP_Altura');
    drawTextAtCoordinate(firstPage, data.perto_oe_adicao, 'Perto_OE_Adicao');

    drawTextAtCoordinate(firstPage, `${data.ddd_telefone} ${data.telefoneContato}`, 'Telefone/Contato');

    const nomeFornecedor = data.novo_fornecedor?.trim() || data.fornecedorLab?.trim() || '';
    drawTextAtCoordinate(firstPage, nomeFornecedor, 'Fornecedor/Lab');

    drawTextAtCoordinate(firstPage, data.consultorVendedor, 'Consultor/Vendedor');

    const formatarDinheiro = (valor) => {
      const numero = parseFloat(valor);
      if (isNaN(numero)) return '';
      return `R$ ${numero.toFixed(2).replace('.', ',')}`;
    };

    for (let i = 1; i <= 5; i++) {
      const produto = data[`produto_${i}`];
      const quant = data[`quant_${i}`];
      const descricao = data[`descricao_mercadoria_${i}`];
      const valor = data[`valor_${i}`];

      drawTextAtCoordinate(firstPage, produto, `Produto_${i}`);
      drawTextAtCoordinate(firstPage, quant, `Quant_${i}`);
      drawTextAtCoordinate(firstPage, descricao, `Descricao_Mercadoria_${i}`);
      drawTextAtCoordinate(firstPage, formatarDinheiro(valor), `Valor_${i}`);

      drawTextAtCoordinate(firstPage, produto, `Produto_${i}_2`);
      drawTextAtCoordinate(firstPage, quant, `Quant_${i}_2`);
      drawTextAtCoordinate(firstPage, descricao, `Descricao_Mercadoria_${i}_2`);
      drawTextAtCoordinate(firstPage, formatarDinheiro(valor), `Valor_${i}_2`);
    }

    // Forma de Pagamento (marcar 'X')
    const formasPagamento = Array.isArray(data.pagamento) ? data.pagamento : [data.pagamento];

    formasPagamento.forEach((forma) => {
      switch (forma) {
        case 'Dinheiro':
          drawXAtCoordinate(firstPage, 'Pagamento_Dinheiro');
          drawXAtCoordinate(firstPage, 'Pagamento_Dinheiro_2');
          break;
        case 'Pix':
          drawXAtCoordinate(firstPage, 'Pagamento_Pix');
          drawXAtCoordinate(firstPage, 'Pagamento_Pix_2');
          break;
        case 'Débito':
          drawXAtCoordinate(firstPage, 'Pagamento_Debito');
          drawXAtCoordinate(firstPage, 'Pagamento_Debito_2');
          break;
        case 'Crédito':
          drawXAtCoordinate(firstPage, 'Pagamento_Credito');
          drawXAtCoordinate(firstPage, 'Pagamento_Credito_2');
          break;
      }
    });


    drawTextAtCoordinate(firstPage, formatarDinheiro(data.valorTotalProdutos), 'Valor_Total_Produtos');
    drawTextAtCoordinate(firstPage, formatarDinheiro(data.desconto), 'Desconto');
    drawTextAtCoordinate(firstPage, formatarDinheiro(data.valorTotalPagar), 'Valor_Total_a_Pagar');

    drawTextAtCoordinate(firstPage, formatarDinheiro(data.valorTotalProdutos), 'Valor_Total_Produtos_2');
    drawTextAtCoordinate(firstPage, formatarDinheiro(data.desconto), 'Desconto_2');
    drawTextAtCoordinate(firstPage, formatarDinheiro(data.valorTotalPagar), 'Valor_Total_a_Pagar_2');

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    res.status(500).send('Erro ao gerar o PDF. Verifique o console do servidor para mais detalhes.');
  }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
