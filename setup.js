const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PATHS = {
    CLIENT: path.join('ClientWeb', 'app'),
    SERVER: path.join('AdminWeb', 'api'),
    ADMIN: path.join('AdminWeb', 'app')
};

// Define ports for each service
const PORTS = {
    CLIENT: 3000,
    SERVER: 3002,
    ADMIN: 3001
};

// Function to check if node_modules exists
function needsInstall(dir) {
    return !fs.existsSync(path.join(dir, 'node_modules'));
}

// Function to install dependencies
async function installDeps(dir) {
    console.log(`\n📦 Installing dependencies in ${dir}`);
    try {
        execSync('npm install', { 
            cwd: dir, 
            stdio: 'inherit' 
        });
        console.log(`✅ Installation complete in ${dir}`);
    } catch (error) {
        console.error(`❌ Failed to install dependencies in ${dir}`);
        throw error;
    }
}

// Function to start a service
function startService(dir, name, port) {
    console.log(`\n🚀 Starting ${name} on port ${port}...`);
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    const env = {
        ...process.env,
        PORT: port,
        BROWSER: 'none', // Prevent opening browser automatically
    };

    const proc = spawn(npm, ['start'], {
        cwd: dir,
        stdio: 'inherit',
        shell: true,
        env
    });

    proc.on('error', (err) => {
        console.error(`❌ Error starting ${name}:`, err);
    });

    return proc;
}

// Main setup function
async function setup() {
    console.log('🔧 Starting project setup...\n');
    const baseDir = process.cwd();

    try {
        // Install dependencies if needed
        for (const [key, relativePath] of Object.entries(PATHS)) {
            const fullPath = path.join(baseDir, relativePath);
            if (needsInstall(fullPath)) {
                await installDeps(fullPath);
            }
        }

        // Start all services
        console.log('\n🎯 Starting all services...');
        const services = [
            { dir: PATHS.CLIENT, name: 'User Client', port: PORTS.CLIENT },
            { dir: PATHS.SERVER, name: 'Server', port: PORTS.SERVER },
            { dir: PATHS.ADMIN, name: 'Admin Client', port: PORTS.ADMIN }
        ];

        services.forEach(({ dir, name, port }) => {
            startService(dir, name, port);
        });

        console.log('\n✨ All services started successfully!');
        console.log('\n📝 Services are running on:');
        console.log(`User Client: http://localhost:${PORTS.CLIENT}`);
        console.log(`Admin Client: http://localhost:${PORTS.ADMIN}`);
        console.log(`Server: http://localhost:${PORTS.SERVER}`);

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

// Run setup
setup();