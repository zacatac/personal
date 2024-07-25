import jsPDF from "jspdf";
import { Bot, Message } from "./types";

export const download = ({
  bot,
  messages,
}: {
  bot?: Bot;
  messages: Message[];
}) => {
  const doc = new jsPDF();
  doc.setFontSize(10); // Set a smaller font size
  let y = 10;
  const pageHeight = doc.internal.pageSize.height;
  const lineHeight = 10; // Adjust line height to fit more text on the page

  // Add PDF title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Memories with ${bot?.name}`, 10, y);
  y += lineHeight + 4; // Add some space after the title
  doc.setFontSize(10); // Reset font size

  messages.forEach((message) => {
    const isUser = message.role === "user";
    const label = isUser ? "you" : bot?.name;
    const text = `${label}: ${message.content}`;
    const splitText = doc.splitTextToSize(text, 180); // Split text to fit within page width

    splitText.forEach((line: string, index: number) => {
      if (y + lineHeight > pageHeight) {
        doc.addPage();
        y = 10; // Reset y position for new page
      }
      if (index === 0) {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 10, y);
        doc.setFont("helvetica", "normal");
        doc.text(
          line.replace(`${label}:`, ""),
          10 + doc.getTextWidth(`${label}: `),
          y
        );
      } else {
        doc.text(line, 10, y);
      }
      y += lineHeight - 2; // Decrease line height spacing
    });
  });
  doc.save(`${bot?.name}.pdf`);
};
