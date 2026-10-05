import java.util.Arrays;

class Main {
    // Ek chhota function: iska frame call hone par stack par banega, return par hatega
    static int square(int x) {
        int result = x * x; // local variable: square ke frame mein //@calc
        return result; // frame hatega, sirf value wapas jaayegi //@ret
    }

    public static void main(String[] args) {
        int n = 5; // primitive: seedha stack frame mein //@n
        int[] arr = {1, 2, 3}; // object: heap par; stack mein sirf address //@arr
        int s = square(n); // naya frame stack ke upar //@call
        System.out.println(s); //@print
        System.out.println(Arrays.toString(arr));
    }
}

// Output:
// 25
// [1, 2, 3]
