const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9а-яё\s-]/gi, "")
        .replace(/\s+/g, "-");

const hasAny = (source: string, values: string[]) => values.some(value => source.includes(value));

export function resolveCourseSlug(nameRU: string, nameEN: string, fallbackId?: string) {
    const ru = nameRU.toLowerCase();
    const en = nameEN.toLowerCase();

    if (hasAny(ru, ["йог"]) || hasAny(en, ["yoga"])) return "yoga";
    if (hasAny(ru, ["стретч"]) || hasAny(en, ["stretch"])) return "stretching";
    if (hasAny(ru, ["фитнес"]) || hasAny(en, ["fitness"])) return "fitness";
    if (hasAny(ru, ["степ"]) || hasAny(en, ["step"])) return "step";
    if (hasAny(ru, ["бодифлекс"]) || hasAny(en, ["bodyflex"])) return "bodyflex";

    return slugify(nameEN || nameRU) || fallbackId || "course";
}

