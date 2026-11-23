/**
 * Selectable invitation themes. The actual colours live in src/index.css under
 * `:root[data-theme="<id>"]`; `preview` here only feeds the swatches on the settings page.
 */
export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  style: 'classic' | 'tech';
  /** 'minimalism' swaps the whole page for the Chung Đôi Minimalism layout. */
  layout?: 'standard' | 'minimalism' | 'songhy' | 'songhyv2';
  preview: { bg: string; surface: string; accent: string; accent2: string; text: string };
}

export const DEFAULT_THEME_ID = 'classic';

export const THEMES: ThemeOption[] = [
  {
    id: 'classic',
    name: 'Rượu Vang Cổ Điển',
    description: 'Nền ngà, đỏ rượu vang và vàng đồng — trang trọng, truyền thống.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#FBF8F2', surface: '#FFFDF9', accent: '#88292F', accent2: '#A8834E', text: '#2B1F1C' },
  },
  {
    id: 'sage',
    name: 'Xanh Lá Thanh Lịch',
    description: 'Nền sáng, xanh lá trầm hợp với ảnh cưới ngoài vườn.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#F6F7F1', surface: '#FFFFFB', accent: '#3F6B4F', accent2: '#9C7C44', text: '#1E2A22' },
  },
  {
    id: 'midnight',
    name: 'Đêm Vàng Kim',
    description: 'Dark mode sang trọng: nền đen ấm, chữ và điểm nhấn vàng kim.',
    mode: 'dark',
    style: 'classic',
    preview: { bg: '#0F0E0D', surface: '#181614', accent: '#D4AF6A', accent2: '#B89A5E', text: '#F2ECE1' },
  },
  {
    id: 'neon',
    name: 'Neon Công Nghệ',
    description: 'High-tech: nền xanh đen, lưới kỹ thuật, kính mờ, ánh neon xanh–tím.',
    mode: 'dark',
    style: 'tech',
    preview: { bg: '#060A13', surface: '#0C1322', accent: '#22D3EE', accent2: '#A78BFA', text: '#E8F1FF' },
  },
  {
    id: 'aurora',
    name: 'Cực Quang Tím',
    description: 'High-tech: nền tím đêm, chuyển sắc tím–hồng phát sáng.',
    mode: 'dark',
    style: 'tech',
    preview: { bg: '#0B0715', surface: '#140D24', accent: '#C084FC', accent2: '#F472B6', text: '#F3ECFF' },
  },
  {
    id: 'songhy-red',
    name: 'Song Hỷ Đỏ',
    description: 'Truyền thống: đỏ sơn mài, vàng kim, chữ song hỷ và ảnh khung vòm.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#FFF7E8', surface: '#FFFCF4', accent: '#B1121B', accent2: '#B8862F', text: '#5A0C10' },
  },
  {
    id: 'songhy-green',
    name: 'Song Hỷ Xanh',
    description: 'Truyền thống: xanh rêu đậm, kem và vàng, chữ song hỷ và ảnh khung vòm.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#FBF7EC', surface: '#FFFDF6', accent: '#1F4A30', accent2: '#B08A3C', text: '#14301F' },
  },
  {
    id: 'minimal-brown',
    name: 'Tối Giản Nâu',
    description: 'Tối giản: nền be, chữ nâu mảnh, không hoạ tiết, không đổ bóng.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#F7F2EC', surface: '#FDFAF6', accent: '#6B4A36', accent2: '#9A7B5B', text: '#3B2A20' },
  },
  {
    id: 'marble-gold',
    name: 'Cẩm Thạch Vàng',
    description: 'Nền vân đá trắng, điểm nhấn vàng kim, thanh lịch hiện đại.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#FAF9F5', surface: '#FFFFFF', accent: '#A9812F', accent2: '#8A6A2A', text: '#2E2A26' },
  },
  {
    id: 'minimal-burgundy',
    name: 'Tối Giản Đỏ Đô',
    description: 'Nền giấy kem, chữ đỏ đô, ảnh cưới ló ra từ phong bì có dấu sáp vàng.',
    mode: 'light',
    style: 'classic',
    preview: { bg: '#F6EFE4', surface: '#FBF6EE', accent: '#5E1420', accent2: '#A07A3C', text: '#4A1019' },
  },
  {
    id: 'minimalism-darkred',
    name: 'Minimalism Đỏ Đậm (Chung Đôi)',
    description: 'Bố cục riêng theo mẫu Chung Đôi: phong bì, thẻ đỏ đô, album 3D, lịch tháng, hộp quà.',
    mode: 'light',
    style: 'classic',
    layout: 'minimalism',
    preview: { bg: '#FFF7EB', surface: '#FFFAF3', accent: '#511419', accent2: '#C9A24A', text: '#511419' },
  },
  {
    id: 'songhy-xanh-full',
    name: 'Song Hỷ Xanh (Chung Đôi)',
    description: 'Bố cục riêng theo mẫu Chung Đôi: vòm chữ hỷ, dải tiêu đề xanh rêu, album 3D, lịch tháng, hộp quà.',
    mode: 'light',
    style: 'classic',
    layout: 'songhy',
    preview: { bg: '#FFF7EB', surface: '#FFFFFF', accent: '#1F3A25', accent2: '#7CB882', text: '#1F3A25' },
  },
  {
    id: 'songhy-v2-do-full',
    name: 'Song Hỷ V2 Đỏ (Chung Đôi)',
    description: 'Bố cục riêng theo mẫu Chung Đôi: nền đỏ son, thẻ kem viền đào, chữ hỷ, đếm ngược, lịch tháng, hộp quà.',
    mode: 'light',
    style: 'classic',
    layout: 'songhyv2',
    preview: { bg: '#8C0000', surface: '#FFF9E6', accent: '#FFE8A4', accent2: '#FDCB9C', text: '#FFE8A4' },
  },
];

export function resolveTheme(id: string | undefined): ThemeOption {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
