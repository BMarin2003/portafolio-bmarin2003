// Formato de sprite como código: paleta + cuadros de texto.
export type Palette = Record<string, string | null>;
export type SpriteDef = {
  name: string;
  width: number;
  height: number;
  palette: Palette;
  animations: Record<string, string[][]>;
};

export function validateSprite(def: SpriteDef): string[] {
  const errors: string[] = [];
  if (def.palette['.'] !== null) errors.push(`${def.name}: '.' debe ser null en la paleta`);
  for (const [ch, color] of Object.entries(def.palette)) {
    if (ch.length !== 1) errors.push(`${def.name}: clave de paleta '${ch}' debe ser un carácter`);
    if (color !== null && !/^#[0-9a-fA-F]{6}$/.test(color)) errors.push(`${def.name}: color '${color}' no es #RRGGBB`);
  }
  for (const [anim, frames] of Object.entries(def.animations)) {
    frames.forEach((rows, f) => {
      const at = `${def.name}/${anim}/${f}`;
      if (rows.length !== def.height) errors.push(`${at}: ${rows.length} filas, se esperaban ${def.height}`);
      rows.forEach((row, y) => {
        if (row.length !== def.width) errors.push(`${at}/${y}: largo ${row.length}, se esperaba ${def.width}`);
        for (const ch of row) {
          if (!(ch in def.palette)) errors.push(`${at}/${y}: carácter '${ch}' fuera de la paleta`);
        }
      });
    });
  }
  return errors;
}
