import chalk from 'chalk'
import boxen from 'boxen'

const initialSetupMessage = () => {
    const message = `
    ${chalk.bold.blue('🔧 INITIAL ENVIRONMENT SETUP')}
    
    ${chalk.green('✅ Environment configured successfully.')}
    
    ${chalk.yellow('👥 Mock users created:')}
    - ${chalk.cyan('user1')} | User: user1@shhub.com | Pass: 1234
    - ${chalk.cyan('user2')} | User: user2@shhub.com | Pass: 1234
    - ${chalk.cyan('user3')} | User: user3@shhub.com | Pass: 1234
    - ${chalk.cyan('user4')} | User: user4@shhub.com | Pass: 1234
    - ${chalk.cyan('user5')} | User: user5@shhub.com | Pass: 1234
    
    ${chalk.green('📦 Mock products inserted successfully.')}
    
    ${chalk.magentaBright('💡 TIP:')}
    All products are linked to the above users.
    `;

    console.log(
        boxen(message, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
        })
    )
}

export default initialSetupMessage;