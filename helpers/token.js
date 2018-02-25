const jwt = require('jsonwebtoken');

const secreto = "SuPeRcAlIfRaGiLiStIcOsPiAlIdOSoDiLaVeRdAdSiErEsVeRdAdOsO";

module.exports = class TokenManagement {
    static generateToken(data) {
        return jwt.sign(
            { id: data }, 
            secreto, 
            { expiresIn: "2 hours" }
        );
    }

    static getSecreto(){
        return secreto;
    }
}