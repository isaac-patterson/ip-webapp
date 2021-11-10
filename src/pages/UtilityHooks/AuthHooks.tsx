import { Auth } from "aws-amplify"

export const useGetCognitoId = () => {
    return async () => {
        let cognitoId
        await Auth.currentSession() // method will refresh jwt token if needed
            .then(data => {
                cognitoId = data.getIdToken().payload.sub
            }
            );
        return cognitoId
    }
}

export const useGetSession = () => {
    return async (both) => {
        let cognitoId
        let jwtToken
        await Auth.currentSession() // method will refresh jwt token if needed
            .then(data => {
                let sessionData = data.getIdToken()
                jwtToken = sessionData.getJwtToken()
                cognitoId = sessionData.payload.sub
            });

        if (both) return { cognitoId, jwtToken }
        else return jwtToken
    }
}
