export function serverBuildTimeLogger() {
    const buildTime = new Date().toISOString();
    console.log(`Server build time: ${buildTime}`);
    return buildTime;
}