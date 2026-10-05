import java.util.ArrayList;
import java.util.List;

class Main {
    static class DNode {
        final int value;
        DNode prev, next;

        DNode(int value) {
            this.value = value;
        }
    }

    // Doubly list: aage aur peeche dono taraf arrow. head/tail nakli (sentinel) nodes - kabhi null check nahi.
    static class DList {
        final DNode head = new DNode(-1);
        final DNode tail = new DNode(-1);

        DList() {
            head.next = tail;
            tail.prev = head;
        }

        void addLast(DNode node) {
            DNode last = tail.prev;
            node.prev = last;
            node.next = tail;
            last.next = node;
            tail.prev = node;
        }

        // node ka pata hai to O(1) mein nikaalo (singly mein pichhla dhoondhna padta: O(n))
        void remove(DNode node) {
            DNode p = node.prev; // pichhla aur agla dono node ke paas hi hain //@grab
            DNode n = node.next;
            p.next = n; // pichhla ab agle ko pakde //@link1
            n.prev = p; // agla ab pichhle ko //@link2
            node.prev = null; // purane node ke arrows saaf - galti se use na ho //@clean
            node.next = null;
        }

        String forward() {
            List<Integer> out = new ArrayList<>();
            for (DNode c = head.next; c != tail; c = c.next) out.add(c.value);
            return out.toString();
        }

        String backward() {
            List<Integer> out = new ArrayList<>();
            for (DNode c = tail.prev; c != head; c = c.prev) out.add(c.value);
            return out.toString();
        }
    }

    public static void main(String[] args) {
        DList list = new DList();
        DNode[] nodes = {new DNode(10), new DNode(20), new DNode(30), new DNode(40)};
        for (DNode d : nodes) list.addLast(d);
        list.remove(nodes[2]); // 30 hatao - seedha node se
        System.out.println(list.forward());
        list.remove(nodes[0]); // pehla bhi bina special case ke
        System.out.println(list.forward());
        System.out.println("ulta: " + list.backward());
    }
}

// Output:
// [10, 20, 40]
// [20, 40]
// ulta: [40, 20]
