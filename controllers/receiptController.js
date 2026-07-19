const PDFDocument=require("pdfkit");

exports.downloadReceipt=(req,res)=>{

const doc=new PDFDocument();

res.setHeader(
"Content-Type",
"application/pdf"
);

doc.pipe(res);

doc.fontSize(20)
.text("GK EVENT MANAGEMENT");

doc.moveDown();

doc.text("Booking Receipt");

doc.moveDown();

doc.text("Booking ID : "+req.params.id);

doc.text("Customer : Rahul");

doc.text("Booking : Marriage");

doc.text("Amount : ₹15000");

doc.text("Status : Paid");

doc.end();

};