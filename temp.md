### TAKUT BANGET LOH
Sebenernya udah gabutuh, tapi takut aja kalo diapus
```
const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/bash");
        const id = res.data.data._id;
        if (id !== params) {
          router.push(`/profile/${id}`);
          toa2st.error("Invalid URL, redirecting...");
        }
        setData(res.data.data.username); 
        setUserId(res.data.data._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
        logout();
      }
    };

    fetchUserDetails();
```
