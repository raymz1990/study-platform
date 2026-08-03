"""
Gera ícones PWA a partir do design do icon.svg.
Cria versões 192x192, 512x512 e maskable (512x512 com padding de segurança).
"""

from PIL import Image, ImageDraw
import os

# Cores do design system
BLUE = '#2563eb'
WHITE = '#ffffff'
GREEN = '#22c55e'

# Dimensões
SIZES = [192, 512]
PADDING_MASKABLE = 0.1  # 10% de padding para ícone maskable

def draw_icon(size: int) -> Image.Image:
    """Desenha o ícone no tamanho especificado."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Raio dos cantos arredondados (proporcional ao SVG: rx=96 em 512)
    rx = int(size * 96 / 512)
    
    # Fundo azul arredondado
    draw.rounded_rectangle([0, 0, size, size], radius=rx, fill=BLUE)
    
    # Linhas horizontais brancas (representando lista/checklist)
    line_y_positions = [0.3125, 0.46875, 0.625]  # 160/512, 240/512, 320/512
    line_heights = [0.0625, 0.0625, 0.0625]  # 32/512
    line_widths = [0.5, 0.375, 0.5]  # 256/512, 192/512, 256/512
    
    for y_pos, h, w in zip(line_y_positions, line_heights, line_widths):
        y = int(size * y_pos)
        line_h = max(1, int(size * h))
        line_w = int(size * w)
        x = int(size * 0.25)  # 128/512
        draw.rounded_rectangle([x, y, x + line_w, y + line_h], radius=line_h // 2, fill=WHITE)
    
    # Círculo verde com checkmark (posição inferior direita)
    circle_center = (int(size * 0.75), int(size * 0.75))  # 384/512
    circle_radius = int(size * 48 / 512)
    
    # Fundo do círculo verde
    draw.ellipse([
        circle_center[0] - circle_radius, circle_center[1] - circle_radius,
        circle_center[0] + circle_radius, circle_center[1] + circle_radius
    ], fill=GREEN)
    
    # Checkmark branco dentro do círculo
    # Coordenadas proporcionais ao SVG: M372 384 l8 8 16-16
    # Ponto base (372, 384) relativo ao centro (384, 384)
    base_x = circle_center[0] - int(size * 12 / 512)  # 372 = 384 - 12
    base_y = circle_center[1]  # 384
    
    # Checkmark como linhas grossas arredondadas
    stroke_width = max(2, int(size * 6 / 512))
    
    # Ponto 1 → 2 (372→380, 384→392)
    p1 = (base_x, base_y)
    p2 = (base_x + int(size * 8 / 512), base_y + int(size * 8 / 512))
    # Ponto 2 → 3 (380→396, 392→376)
    p3 = (p2[0] + int(size * 16 / 512), p2[1] - int(size * 16 / 512))
    
    draw.line([p1, p2], fill=WHITE, width=stroke_width)
    draw.line([p2, p3], fill=WHITE, width=stroke_width)
    
    return img

def draw_maskable(size: int) -> Image.Image:
    """Desenha ícone maskable com padding de segurança."""
    # O ícone maskable precisa ter conteúdo seguro dentro de um círculo central
    # Padding de 10% em todos os lados
    padding = int(size * PADDING_MASKABLE)
    content_size = size - 2 * padding
    
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Fundo azul arredondado (um pouco menor para caber no safe zone)
    rx = int(content_size * 96 / 512)
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=rx, fill=BLUE
    )
    
    # Ajustar coordenadas para o padding
    scale = content_size / size
    
    # Linhas horizontais
    line_y_positions = [0.3125, 0.46875, 0.625]
    line_widths = [0.5, 0.375, 0.5]
    line_heights = [0.0625, 0.0625, 0.0625]
    
    for y_pos, w, h in zip(line_y_positions, line_widths, line_heights):
        y = padding + int(content_size * y_pos)
        line_h = max(1, int(content_size * h))
        line_w = int(content_size * w)
        x = padding + int(content_size * 0.25)
        draw.rounded_rectangle([x, y, x + line_w, y + line_h], radius=line_h // 2, fill=WHITE)
    
    # Círculo verde
    circle_rel_x = 0.75
    circle_rel_y = 0.75
    circle_center = (padding + int(content_size * circle_rel_x), padding + int(content_size * circle_rel_y))
    circle_radius = int(content_size * 48 / 512)
    
    draw.ellipse([
        circle_center[0] - circle_radius, circle_center[1] - circle_radius,
        circle_center[0] + circle_radius, circle_center[1] + circle_radius
    ], fill=GREEN)
    
    # Checkmark
    stroke_width = max(2, int(content_size * 6 / 512))
    base_x = circle_center[0] - int(content_size * 12 / 512)
    base_y = circle_center[1]
    
    p1 = (base_x, base_y)
    p2 = (base_x + int(content_size * 8 / 512), base_y + int(content_size * 8 / 512))
    p3 = (p2[0] + int(content_size * 16 / 512), p2[1] - int(content_size * 16 / 512))
    
    draw.line([p1, p2], fill=WHITE, width=stroke_width)
    draw.line([p2, p3], fill=WHITE, width=stroke_width)
    
    return img

def main():
    output_dir = 'public'
    os.makedirs(output_dir, exist_ok=True)
    
    for size in SIZES:
        # Ícone padrão
        icon = draw_icon(size)
        icon.save(os.path.join(output_dir, f'icon-{size}x{size}.png'), 'PNG')
        print(f'Generated: icon-{size}x{size}.png')
    
    # Ícone maskable 512x512
    maskable = draw_maskable(512)
    maskable.save(os.path.join(output_dir, 'icon-maskable-512x512.png'), 'PNG')
    print('Generated: icon-maskable-512x512.png')
    
    # Favicon ico (usando 192x192)
    icon_192 = draw_icon(192)
    # ICO requer múltiplos tamanhos, salvamos como PNG para favicon
    icon_192.save(os.path.join(output_dir, 'favicon.png'), 'PNG')
    print('Generated: favicon.png')

if __name__ == '__main__':
    main()
