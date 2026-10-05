class Main {
    // Char array ko recursion se ulta karo (in-place)
    static void reverse(char[] s, int l, int r) {
        if (l >= r) return; // 0 ya 1 char bacha: kuch nahi karna //@base
        char t = s[l]; // dono kinare badlo //@swap
        s[l] = s[r];
        s[r] = t;
        reverse(s, l + 1, r - 1); // andar wala hissa: wahi sawaal, 2 chhota //@call
    }

    public static void main(String[] args) {
        char[] s = "hello".toCharArray();
        reverse(s, 0, s.length - 1);
        System.out.println(new String(s));
        char[] one = "a".toCharArray();
        reverse(one, 0, one.length - 1);
        System.out.println(new String(one));
    }
}

// Output:
// olleh
// a
