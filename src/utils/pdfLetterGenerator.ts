import { jsPDF } from 'jspdf';

// Ultra-Luxury Handwritten Royal Parchment PDF Letter Generator
// Crafts an exquisite, keepsake A4 apology letter for Ovi ma with:
// - Antique parchment watercolor texture & vignette
// - Victorian 24K rose gold filigree borders & decorative corner flourishes
// - Authentic Air Mail vintage postage stamp with postmark cancellation
// - Subtle notebook ruled lines & crimson margin
// - Rich fountain pen typography in warm plum-espresso
// - Hand-crafted 3D ruby-crimson wax seal with satin ribbon tails
export const generateLuxuryApologyPdf = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  // A4 Ratio 1:1.414 @ High-Definition (1485 x 2100 px)
  const width = 1485;
  const height = 2100;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. BASE BACKGROUND: Antique Ivory-Rose Parchment
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0.0, '#fefbf7');
  bgGrad.addColorStop(0.3, '#fff4f6');
  bgGrad.addColorStop(0.7, '#fff0f3');
  bgGrad.addColorStop(1.0, '#fcedf1');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft ambient radial glow in the center
  const glowGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width * 0.7);
  glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  glowGrad.addColorStop(0.6, 'rgba(255, 245, 247, 0.3)');
  glowGrad.addColorStop(1, 'rgba(244, 114, 182, 0.05)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // Vignette dark edges
  const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.45, width / 2, height / 2, width * 0.85);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(190, 24, 93, 0.07)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // 2. DOUBLE ORNATE ROSE GOLD BORDERS
  const marginOuter = 52;
  const marginInner = 68;

  // Outer Border: Bold Crimson-Rose Gold
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(marginOuter, marginOuter, width - marginOuter * 2, height - marginOuter * 2);

  // Inner Border: Delicate Rose Filigree
  ctx.strokeStyle = '#f43f6e';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(marginInner, marginInner, width - marginInner * 2, height - marginInner * 2);

  // Corner Flourish Helper: Draws Victorian Ornate Corner Brackets
  const drawCornerFlourish = (cx: number, cy: number, flipX: number, flipY: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipX, flipY);

    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(14, 4);
    ctx.bezierCurveTo(35, 4, 48, 18, 48, 40);
    ctx.bezierCurveTo(48, 25, 62, 14, 82, 14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(4, 14);
    ctx.bezierCurveTo(4, 35, 18, 48, 40, 48);
    ctx.bezierCurveTo(25, 48, 14, 62, 14, 82);
    ctx.stroke();

    // Corner Ruby Jewel Dot
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(26, 26, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(24.5, 24.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  drawCornerFlourish(marginInner + 4, marginInner + 4, 1, 1);
  drawCornerFlourish(width - marginInner - 4, marginInner + 4, -1, 1);
  drawCornerFlourish(marginInner + 4, height - marginInner - 4, 1, -1);
  drawCornerFlourish(width - marginInner - 4, height - marginInner - 4, -1, -1);

  // 3. VINTAGE AIR MAIL POSTAGE STAMP (Top-Right)
  const stampX = width - marginInner - 240;
  const stampY = marginInner + 30;
  const stampW = 200;
  const stampH = 150;

  // Scalloped Stamp Perforations
  ctx.save();
  ctx.fillStyle = '#fff0f3';
  ctx.shadowColor = 'rgba(190, 24, 93, 0.15)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillRect(stampX, stampY, stampW, stampH);
  ctx.restore();

  // Stamp Dashed Border
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(stampX + 7, stampY + 7, stampW - 14, stampH - 14);
  ctx.setLineDash([]);

  // Stamp Content: Rose & Typography
  ctx.fillStyle = '#9f1239';
  ctx.font = 'bold 11px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText('AIR MAIL · PAR AVION', stampX + stampW / 2, stampY + 28);

  // Hand-drawn Mini Rose Emblem
  ctx.save();
  ctx.translate(stampX + stampW / 2, stampY + 72);
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-2, -2, 9, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(-2, -5, 6, 0, Math.PI * 2);
  ctx.fill();
  // Rose Leaf
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(15, 8, 8, 3.5, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#880e4f';
  ctx.font = 'bold 12px "Cinzel", "Times New Roman", serif';
  ctx.fillText('PRIORITY LOVE', stampX + stampW / 2, stampY + 115);
  ctx.font = 'bold italic 13px "Georgia", serif';
  ctx.fillStyle = '#e11d48';
  ctx.fillText('FOR OVI MA ♡', stampX + stampW / 2, stampY + 135);

  // Slanted Rubber Postmark Stamp
  ctx.save();
  ctx.translate(stampX + 15, stampY + 105);
  ctx.rotate((-16 * Math.PI) / 180);
  ctx.strokeStyle = 'rgba(185, 28, 28, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 37, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(185, 28, 28, 0.55)';
  ctx.font = 'bold 8.5px "Cinzel", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SPECIAL DELIVERY', 0, -16);
  ctx.fillText('★ 2026 ★', 0, 0);
  ctx.fillText('ETERNAL LOVE', 0, 18);

  // Postmark Wave Lines
  ctx.beginPath();
  for (let w = 0; w < 3; w++) {
    const wy = -10 + w * 10;
    ctx.moveTo(-90, wy);
    ctx.bezierCurveTo(-75, wy - 5, -60, wy + 5, -45, wy);
  }
  ctx.stroke();
  ctx.restore();

  // 4. ELEGANT HEADER TITLE & ROYAL FLOURISH
  const headerY = marginInner + 85;

  // Twin Laurel Crest
  ctx.strokeStyle = '#f43f6e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(width / 2 - 32, headerY - 24, 18, 0.3 * Math.PI, 1.2 * Math.PI);
  ctx.arc(width / 2 + 32, headerY - 24, 18, -0.2 * Math.PI, 0.7 * Math.PI);
  ctx.stroke();

  // Heart at crest
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(width / 2 - 5, headerY - 28, 5, 0, Math.PI * 2);
  ctx.arc(width / 2 + 5, headerY - 28, 5, 0, Math.PI * 2);
  ctx.moveTo(width / 2 - 10, headerY - 26);
  ctx.lineTo(width / 2, headerY - 17);
  ctx.lineTo(width / 2 + 10, headerY - 26);
  ctx.fill();

  // Main Header: "IT'S FROM MY HEART ❤️"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#880e4f';
  ctx.font = 'bold 42px "Cinzel", "Times New Roman", serif';
  ctx.letterSpacing = '3px';
  ctx.fillText("IT'S FROM MY HEART ❤️", width / 2, headerY + 18);

  // Decorative Center Filigree Divider
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, headerY + 46);
  ctx.lineTo(width / 2 - 25, headerY + 46);
  ctx.moveTo(width / 2 + 25, headerY + 46);
  ctx.lineTo(width / 2 + 200, headerY + 46);
  ctx.stroke();

  // Diamond in center of divider
  ctx.fillStyle = '#be123c';
  ctx.save();
  ctx.translate(width / 2, headerY + 46);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-5, -5, 10, 10);
  ctx.restore();

  // 5. NOTEBOOK RED MARGIN LINE & DELICATE FEINT RULES
  const lineStartY = headerY + 120;
  const lineEndY = height - marginInner - 220;
  const textLeft = 240;
  const textRight = width - marginInner - 80;
  const lineHeight = 58;

  // Feint soft ruled lines
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.12)';
  ctx.lineWidth = 1;
  for (let ly = lineStartY + 10; ly <= lineEndY + 60; ly += lineHeight) {
    ctx.beginPath();
    ctx.moveTo(170, ly);
    ctx.lineTo(textRight, ly);
    ctx.stroke();
  }

  // Left Notebook Red Margin Line
  ctx.strokeStyle = 'rgba(225, 29, 72, 0.35)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(210, lineStartY - 30);
  ctx.lineTo(210, lineEndY + 80);
  ctx.stroke();

  // 6. LETTER BODY CONTENT (Rich Handwritten-Style Typography)
  ctx.textAlign = 'left';
  let curY = lineStartY + 30;

  // Salutation
  ctx.fillStyle = '#880e4f';
  ctx.font = 'bold italic 34px "Georgia", "Times New Roman", serif';
  ctx.fillText('Dear Ovi ma,', textLeft, curY);
  curY += lineHeight * 1.35;

  // Letter Paragraphs Structure
  const paragraphs: {
    lines: string[];
    isBold?: boolean;
    isHighlight?: boolean;
    spaceAfter?: number;
  }[] = [
    {
      lines: ["Unna hurt pannirundha, from my heart, I'm really sorry."],
      spaceAfter: 1.15,
    },
    {
      lines: [
        'Sila neram kovathula pesura vaarthaigal evlo hurt pannumnu',
        'yosikkaama poiduren. Aana un feelings-ah naan light-ah eduthukala.',
      ],
      spaceAfter: 1.15,
    },
    {
      lines: [
        'Unna convince panradhukku mattum indha page create pannala.',
        'Naan enna thappa pannirundhen, adha purinjukittu better-ah maara virumburen.',
      ],
      spaceAfter: 1.15,
    },
    {
      lines: [
        'Unna naan respect pannanum. Un feelings-ah kekkanum.',
        'Unakku thevaiyana space kudukkanum.',
      ],
      spaceAfter: 1.3,
    },
    {
      lines: ["I'm sorry, Ovi ma. ❤️"],
      isBold: true,
      isHighlight: true,
      spaceAfter: 1.4,
    },
  ];

  paragraphs.forEach((p) => {
    if (p.isHighlight) {
      ctx.fillStyle = '#9f1239';
      ctx.font = 'bold italic 32px "Georgia", "Times New Roman", serif';
    } else {
      ctx.fillStyle = '#260d19'; // Warm rich espresso-plum ink
      ctx.font = '27px "Georgia", "Times New Roman", serif';
    }

    p.lines.forEach((line) => {
      ctx.fillText(line, textLeft, curY);
      curY += lineHeight;
    });

    if (p.spaceAfter) {
      curY += lineHeight * (p.spaceAfter - 1);
    }
  });

  // Sign-off (Right-aligned)
  ctx.textAlign = 'right';
  ctx.fillStyle = '#880e4f';
  ctx.font = 'italic 28px "Georgia", "Times New Roman", serif';
  ctx.fillText('— Endrum unakkaga, naan.', textRight - 40, curY);
  curY += 60;

  // 7. HANDCRAFTED 3D RUBY WAX SEAL WITH SATIN RIBBONS (Bottom Center)
  const sealX = width / 2;
  const sealY = height - marginInner - 165;

  // Left Satin Ribbon Tail
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.fillStyle = '#9f1239';
  ctx.beginPath();
  ctx.moveTo(-16, 20);
  ctx.lineTo(-48, 100);
  ctx.lineTo(-32, 90); // V-cut notch
  ctx.lineTo(-12, 105);
  ctx.lineTo(-2, 20);
  ctx.closePath();
  ctx.fill();

  // Right Satin Ribbon Tail
  ctx.fillStyle = '#be123c';
  ctx.beginPath();
  ctx.moveTo(2, 20);
  ctx.lineTo(12, 105);
  ctx.lineTo(32, 90); // V-cut notch
  ctx.lineTo(48, 100);
  ctx.lineTo(16, 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Outer Organic Wax Drips
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.fillStyle = '#9f1239';
  ctx.shadowColor = 'rgba(136, 14, 79, 0.35)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  // 16 scalloped organic wax rim lobes
  ctx.beginPath();
  const rimRadius = 64;
  for (let i = 0; i <= 32; i++) {
    const angle = (i * Math.PI) / 16;
    const r = rimRadius + (i % 2 === 0 ? 5 : -3) + Math.sin(i * 3) * 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Inner Wax Medallion: Beveled 3D Ruby Gradient
  ctx.save();
  ctx.translate(sealX, sealY);
  const waxGrad = ctx.createRadialGradient(-10, -10, 8, 0, 0, 56);
  waxGrad.addColorStop(0, '#f43f6e');
  waxGrad.addColorStop(0.3, '#e11d48');
  waxGrad.addColorStop(0.7, '#be123c');
  waxGrad.addColorStop(1, '#880e4f');
  ctx.fillStyle = waxGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.fill();

  // Debossed Gold Inner Ring
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Embossed Center Gold Heart & Wreath
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;

  // Heart
  ctx.beginPath();
  ctx.arc(-8, -6, 9, 0, Math.PI * 2);
  ctx.arc(8, -6, 9, 0, Math.PI * 2);
  ctx.moveTo(-16, -2);
  ctx.lineTo(0, 14);
  ctx.lineTo(16, -2);
  ctx.fill();

  // Seal Text
  ctx.fillStyle = '#ffe4ea';
  ctx.font = 'bold 9px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText('ALWAYS YOURS', 0, 32);
  ctx.restore();

  // 8. LUXURY BOTTOM FOOTER
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9f1239';
  ctx.font = 'italic 16.5px "Georgia", "Times New Roman", serif';
  ctx.fillText('“Written with heartfelt remorse, endless respect & unconditional love.”', width / 2, height - marginInner - 45);

  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 12px "Cinzel", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('EXCLUSIVE KEEPSAKE · DEDICATED FOR OVI MA ♡', width / 2, height - marginInner - 22);

  // 9. CONVERT CANVAS TO PDF & TRIGGER SEAMLESS DOWNLOAD
  const imgData = canvas.toDataURL('image/jpeg', 0.96);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  doc.save('For_Ovi_ma_Apology_Letter.pdf');
};
