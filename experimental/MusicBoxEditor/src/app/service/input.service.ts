
export class InputService {

    static keyCode = {
        Enter: 13,
        ArrowUp: 38,
        ArrowDown: 40,
        ArrowLeft: 37,
        ArrowRight: 39
    };

    static isKeyDown(event: KeyboardEvent ,keyCode: number){
        if(event.keyCode === keyCode){
            return true;
        }

        if(event.which === keyCode){
            return true;
        }

        if(InputService.keyCode[event.code] === keyCode){
            return true;
        }

        if(InputService.keyCode[event.key] === keyCode){
            return true;
        }

        return false;
    }
}