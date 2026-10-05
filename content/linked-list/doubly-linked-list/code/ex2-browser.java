class Main {
    // Browser ki back / forward history
    static class BrowserHistory {
        private static class Page {
            final String url;
            Page prev, next;

            Page(String url) {
                this.url = url;
            }
        }

        private Page cur;

        BrowserHistory(String homepage) {
            cur = new Page(homepage);
        }

        void visit(String url) {
            Page p = new Page(url);
            cur.next = p; // naya page: aage ki purani history kat gayi //@visit
            p.prev = cur;
            cur = p;
        }

        String back(int steps) {
            while (steps > 0 && cur.prev != null) { // isse peeche kuch nahi: ruk jao //@back
                cur = cur.prev;
                steps--;
            }
            return cur.url;
        }

        String forward(int steps) {
            while (steps > 0 && cur.next != null) { //@forward
                cur = cur.next;
                steps--;
            }
            return cur.url;
        }
    }

    public static void main(String[] args) {
        BrowserHistory b = new BrowserHistory("leetcode.com");
        b.visit("google.com");
        b.visit("facebook.com");
        b.visit("youtube.com");
        System.out.println(b.back(1));
        System.out.println(b.back(1));
        System.out.println(b.forward(1));
        b.visit("linkedin.com"); // youtube wali forward history ab gayab
        System.out.println(b.forward(2));
        System.out.println(b.back(2));
        System.out.println(b.back(7)); // jitna ho sake utna peeche
    }
}

// Output:
// facebook.com
// google.com
// facebook.com
// linkedin.com
// google.com
// leetcode.com
