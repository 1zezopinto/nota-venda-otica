import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const coordenadasPath = path.join(process.cwd(), 'coordenadas.json');
const modeloPdfPath = path.join(process.cwd(), 'modelo', 'nota.pdf');

const coordinates = JSON.parse(fs.readFileSync(coordenadasPath, 'utf8'));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const data = req.body;
    const existingPdfBytes = fs.readFileSync(modeloPdfPath);
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

    // ...Cole aqui o mesmo conteúdo de preenchimento que você já tinha com drawTextAtCoordinate() e drawXAtCoordinate()...
    // Preenchimento dos campos de texto usando as coordenadas
    drawTextAtCoordinate(firstPage, data.cliente, 'Cliente');
    drawTextAtCoordinate(firstPage, data.cpf, 'CPF');
    drawTextAtCoordinate(firstPage, data.paciente, 'Paciente');
    drawTextAtCoordinate(firstPage, data.bairro, 'Bairro');
    drawTextAtCoordinate(firstPage, data.endereco, 'Endereço');
    drawTextAtCoordinate(firstPage, data.cidade, 'Cidade');
    drawTextAtCoordinate(firstPage, data.estado, 'Est');
    drawTextAtCoordinate(firstPage, data.dataCompra, 'Data Compra');
    drawTextAtCoordinate(firstPage, data.prevEntrega, 'Prev. Entrega');
    drawTextAtCoordinate(firstPage, data.medico, 'Médico');

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

    // Telefone/Contato, Fornecedor/Lab, Consultor/Vendedor
    drawTextAtCoordinate(firstPage, `(${data.ddd_telefone}) ${data.telefoneContato}`, 'Telefone/Contato');
    drawTextAtCoordinate(firstPage, data.fornecedorLab, 'Fornecedor/Lab');
    drawTextAtCoordinate(firstPage, data.consultorVendedor, 'Consultor/Vendedor');

    // Primeira seção de produtos
    drawTextAtCoordinate(firstPage, produto, `Produto_${i}`);
    drawTextAtCoordinate(firstPage, quant, `Quant_${i}`);
    drawTextAtCoordinate(firstPage, descricao, `Descricao_Mercadoria_${i}`);
    drawTextAtCoordinate(firstPage, valor, `Valor_${i}`);

    // Segunda seção de produtos
    drawTextAtCoordinate(firstPage, produto, `Produto_${i}_2`);
    drawTextAtCoordinate(firstPage, quant, `Quant_${i}_2`);
    drawTextAtCoordinate(firstPage, descricao, `Descricao_Mercadoria_${i}_2`);
    drawTextAtCoordinate(firstPage, valor, `Valor_${i}_2`);

    // Valores Totais
    drawTextAtCoordinate(firstPage, data.valorTotalProdutos, 'Valor_Total_Produtos');
    drawTextAtCoordinate(firstPage, data.desconto, 'Desconto');
    drawTextAtCoordinate(firstPage, data.valorTotalPagar, 'Valor_Total_a_Pagar');

    // Segunda seção de valores totais
    drawTextAtCoordinate(firstPage, data.valorTotalProdutos, 'Valor_Total_Produtos_2');
    drawTextAtCoordinate(firstPage, data.desconto, 'Desconto_2');
    drawTextAtCoordinate(firstPage, data.valorTotalPagar, 'Valor_Total_a_Pagar_2');


    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    res.status(500).send('Erro ao gerar o PDF');
  }
}
