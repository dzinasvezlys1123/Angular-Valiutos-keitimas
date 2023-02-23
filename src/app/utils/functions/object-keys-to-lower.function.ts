export function toLowerKeys(obj: any) {
    // 👇️ [ ['NAME', 'Tom'], ['AGE', 30] ]
    const entries = Object.entries(obj);
  
    return Object.fromEntries(
      entries.map(([key, value]) => {
        return [key.toLowerCase(), value];
      }),
    );
}