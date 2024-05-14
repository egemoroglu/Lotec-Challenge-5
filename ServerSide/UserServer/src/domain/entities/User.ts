class User{
    userId: string;
    username: string;
    password: string;
    constructor(userId: string, username: string, password: string){
        this.userId = userId;
        this.username = username;
        this.password = password;
    }
    getUserId(){
        return this.userId;
    }

    setUserId(userId:string){
        this.userId = userId;
    }

    getUsername(){
        return this.username;
    }

    getPassword(){
        return this.password;
    }

    setUsername(username: string){
        this.username = username;
    }

    setPassword(password: string){
        this.password = password;
    }

    
}

export default User;