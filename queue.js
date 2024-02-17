class Queue {

    constructor() { this.q = []; }
    send(item) { this.q.push(item); }
    receive() { return this.q.shift(); }
    length() { return this.q.length }
    isEmpty() { return this.q.length == 0; }
    printQueue() {
        var stringBuilder = "";
        for (var item = 0; item < this.q.length; item++)
            //stringBuilder += `${item}:` + this.q[item] + '\n';
            stringBuilder += item + ':' + this.q[item] + '\n';
        return stringBuilder;
    }

}

module.exports = Queue;