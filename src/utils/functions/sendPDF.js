const PDFDocument = require('pdfkit');

function sendPDF(res, pdf) {
  const doc = new PDFDocument();
  doc.pipe(res);
  doc
    .fontSize(25)
    .text(pdf.title, 100, 100);
  doc
    .fontSize(18)
    .text(pdf.text, 100, 200);

  doc.end();
}

module.exports = sendPDF;
