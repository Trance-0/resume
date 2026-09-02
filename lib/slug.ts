export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function courseAnchor(semester: string, course: string) {
  return `course-${slugify(semester)}-${slugify(course)}`;
}
