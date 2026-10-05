import java.util.ArrayDeque;

class Main {
    public static void main(String[] args) {
        int[] values = {1, 2, 3};

        // ArrayDeque ko STACK ki tarah: last mein daalo, last se nikaalo (LIFO)
        // (purani Stack class mat use karo - wo synchronized aur slow hai)
        ArrayDeque<Integer> stack = new ArrayDeque<>();
        for (int v : values) stack.addLast(v); // push: upar rakho //@push
        System.out.println(stack.removeLast()); // pop: jo last aaya wahi pehle niklega //@pop

        // Wahi ArrayDeque QUEUE ki tarah: last mein daalo, first se nikaalo (FIFO)
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int v : values) queue.addLast(v); // enqueue: line mein peeche lago //@enq
        System.out.println(queue.removeFirst()); // dequeue: jo pehle aaya wahi pehle niklega //@deq

        System.out.println(stack);
        System.out.println(queue);
    }
}

// Output:
// 3
// 1
// [1, 2]
// [2, 3]
