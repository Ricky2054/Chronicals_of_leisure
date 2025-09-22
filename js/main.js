// Main initialization for Chronicle of the Ledger
document.addEventListener('DOMContentLoaded', async () => {
    debug.log('DOM loaded, initializing game...', 'info');
    
    try {
        // Initialize the game
        await game.initialize();
        debug.log('Game initialization complete!', 'info');
        
    } catch (error) {
        debug.error(`Game initialization failed: ${error.message}`);
    }
});

// Global functions for UI
function restartGame() {
    debug.log('Restarting game...', 'info');
    game.restart();
}

function mintAchievement() {
    if (!game.blockchain.isConnected()) {
        debug.warning('Cannot mint achievement: wallet not connected');
        alert('Please connect your wallet first!');
        return;
    }
    
    const achievementData = {
        type: 'score_achievement',
        score: game.gameState.score,
        level: game.gameState.level,
        timestamp: Date.now()
    };
    
    game.blockchain.mintAchievement(achievementData).then(result => {
        if (result.success) {
            alert(`Achievement minted successfully! Transaction: ${result.txId}`);
        } else {
            alert(`Failed to mint achievement: ${result.error}`);
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    debug.log('Window resized', 'info');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        debug.log('Game paused (tab hidden)', 'info');
    } else {
        debug.log('Game resumed (tab visible)', 'info');
    }
});

// Handle errors
window.addEventListener('error', (event) => {
    debug.error(`Global error: ${event.error.message}`);
});

window.addEventListener('unhandledrejection', (event) => {
    debug.error(`Unhandled promise rejection: ${event.reason}`);
});

// Export for debugging
window.game = game;
window.debug = debug;
