import readline from "readline";
import fs from "fs";
import chalk from 'chalk';

function generatePassword(length, includeUppercase, includeNumbers, includeSymbols) {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    let characterPool = lowercaseChars;

    if (includeUppercase) characterPool += uppercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    if (characterPool.length === 0) {
        console.log(chalk.red("No character types selected! Cannot generate password."));
        return null;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    return password;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function slowType(text, delay, callback) {
  let index = 0;
  const interval = setInterval(() => {
    process.stdout.write(text.charAt(index));
    index++;
    if (index === text.length) {
      clearInterval(interval); // Stop the animation when all text is displayed
      console.log(); // To move to the next line after the message
      callback(); // Run the callback after the animation is complete
    }
  }, delay); // Delay between characters
}

// Welcome message and author info
const welcomeMessage = chalk.green('***************************************\n      Welcome to Password Generator     \n***************************************');
const authorInfo = chalk.cyan('\nAuthor: Rotex\nGitHub: https://github.com/RotexRx');

// Display the welcome message with a typing animation
slowType(welcomeMessage, 15, () => { 
    // After the welcome message finishes, start the author info animation
    slowType(authorInfo, 15, () => {
        // Once the author info finishes, prompt for user input
        rl.question(chalk.cyan("Enter a name for the password (e.g., 'Email Account'): "), (nameInput) => {
            rl.question(chalk.cyan("Enter the desired password length (default 12): "), (lengthInput) => {
                const length = parseInt(lengthInput) || 12;

                rl.question(chalk.cyan("Include uppercase letters? (y/n, default y): "), (uppercaseInput) => {
                    const includeUppercase = uppercaseInput.toLowerCase() !== "n";

                    rl.question(chalk.cyan("Include numbers? (y/n, default y): "), (numbersInput) => {
                        const includeNumbers = numbersInput.toLowerCase() !== "n";

                        rl.question(chalk.cyan("Include symbols? (y/n, default y): "), (symbolsInput) => {
                            const includeSymbols = symbolsInput.toLowerCase() !== "n";

                            const password = generatePassword(length, includeUppercase, includeNumbers, includeSymbols);
                            if (password) {
                                console.log(chalk.bold.green(`\nYour generated password: ${chalk.yellow(password)}`));

                                const currentDate = new Date().toLocaleString();

                                const entry = `Name: ${nameInput}\nPassword: ${password}\nDate: ${currentDate}\n\n`;

                                fs.appendFile("passwords.txt", entry, (err) => {
                                    if (err) {
                                        console.log(chalk.red("Error saving the password:", err));
                                    } else {
                                        console.log(chalk.bold.blue("Password saved successfully in passwords.txt!\n"));
                                    }
                                });
                            }

                            rl.close();
                        });
                    });
                });
            });
        });
    });
});
