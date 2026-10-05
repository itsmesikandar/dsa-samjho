import java.util.*;

class Main {
    // GALAT: aage badhte hue remove -> agla item khisak ke i par aa jaata hai, aur i++ use skip kar deta hai
    static void removeEvensWrong(List<Integer> list) {
        int i = 0;
        while (i < list.size()) {
            if (list.get(i) % 2 == 0) list.remove(i); // int i -> index se remove //@remove
            i++; // remove ke baad bhi i++ -> naya list[i] kabhi check nahi hua! //@inc
        }
    }

    // SAHI: peeche se chalo - hatane se aage wale items par asar nahi padta
    static void removeEvensRight(List<Integer> list) {
        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i) % 2 == 0) list.remove(i); //@back
        }
    }

    public static void main(String[] args) {
        List<Integer> a = new ArrayList<>(List.of(1, 2, 4, 5, 6, 8));
        removeEvensWrong(a);
        System.out.println(a); // 4 aur 8 bach gaye - bug!
        List<Integer> b = new ArrayList<>(List.of(1, 2, 4, 5, 6, 8));
        removeEvensRight(b);
        System.out.println(b);
    }
}

// Output:
// [1, 4, 5, 8]
// [1, 5]
