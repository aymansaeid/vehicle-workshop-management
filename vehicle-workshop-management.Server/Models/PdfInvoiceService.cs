namespace vehicle_workshop_management.Server.Models
{
    // Services/PdfInvoiceService.cs
    using QuestPDF.Fluent;
    using QuestPDF.Helpers;
    using QuestPDF.Infrastructure;

    public class PdfInvoiceService
    {
        public byte[] GeneratePdf(InvoicePdfDto invoice)
        {
            QuestPDF.Settings.License = LicenseType.Community; // Free license

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .AlignCenter()
                        .Text($"INVOICE #{invoice.InvoiceId}")
                        .SemiBold().FontSize(16);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(col =>
                        {
                            col.Item().Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text($"Customer: {invoice.CustomerName}");
                                    c.Item().Text($"Date: {invoice.FormattedDate}");
                                });

                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text($"Due Date: {invoice.FormattedDueDate}");
                                    c.Item().Text($"Status: {invoice.Status}");
                                });
                            });

                            col.Item().PaddingTop(15).Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(25); // #
                                    columns.RelativeColumn(3); // Description
                                    columns.RelativeColumn();   // Qty
                                    columns.RelativeColumn();   // Price
                                    columns.RelativeColumn();   // Total
                                });

                                // Header
                                table.Header(header =>
                                {
                                    header.Cell().Text("#");
                                    header.Cell().Text("Description");
                                    header.Cell().AlignRight().Text("Qty");
                                    header.Cell().AlignRight().Text("Price");
                                    header.Cell().AlignRight().Text("Total");

                                    header.Cell().ColumnSpan(5).PaddingTop(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten1);
                                });

                                // Lines
                                foreach (var (item, index) in invoice.InvoiceLines.Select((x, i) => (x, i + 1)))
                                {
                                    table.Cell().Element(CellStyle).Text(index.ToString());
                                    table.Cell().Element(CellStyle).Text(item.Description);
                                    table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity.ToString());
                                    table.Cell().Element(CellStyle).AlignRight().Text(item.UnitPrice.ToString("C"));
                                    table.Cell().Element(CellStyle).AlignRight().Text(item.LineTotal.ToString("C"));
                                }

                                // Footer
                                table.Footer(footer =>
                                {
                                    footer.Cell().ColumnSpan(3).AlignRight().Text("TOTAL");
                                    footer.Cell().ColumnSpan(2).AlignRight().Text(invoice.TotalAmount.ToString("C")).Bold();
                                });
                            });

                            if (!string.IsNullOrEmpty(invoice.Notes))
                            {
                                col.Item().PaddingTop(10).Background(Colors.Grey.Lighten3).Padding(10).Text(invoice.Notes);
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                        });
                });
            });

            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }

        static IContainer CellStyle(IContainer container) =>
            container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
    }
}
