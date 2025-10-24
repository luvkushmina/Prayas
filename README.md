# The PRAYASS app acts like a smart video and notes organizer for students.

Here’s how it works in simple terms:

You can easily find and watch your video lectures and read their PDF notes in one place.

To stay focused and avoid distractions, you save your downloaded study materials on your device in a clear folder structure.

Each subject (Physics, Chemistry, Math) has its own folder.

Inside each subject folder, there are chapters, and each chapter contains both the video lectures (.mp4) and notes (.pdf).

---
## 📁 Project Structure(“The project will only work if the files in the folder follow this specific structure.”)

```

PRAYASS/
│
├── Physics/
│   ├── Chapter 1/
│   │   ├── video1.mp4
│   │   └── notes1.pdf
│   ├── Chapter 2/
│   │   ├── video2.mp4
│   │   └── notes2.pdf
│
├── Chemistry/
│   ├── Chapter 1/
│   │   ├── video1.mp4
│   │   └── notes1.pdf
│
├── Math/
│   ├── Chapter 1/
│   │   ├── video1.mp4
│   │   └── notes1.pdf


````

---

## 🚀 Features
- 👌Sidebar menu for easy navigation over pages with hover effects
- 📷 Click any image to view it in a larger lightbox popup  
- 🧭 Simple, clean layout built with HTML & CSS only  
- 💡 Fully functional using the `checkbox` or `:target` pseudo-class  
- 🎨 Smooth transitions, hover effects, and responsive design  
- 🔒 No external libraries or JS dependencies required  
- ⚙️ Optional JavaScript version (for single reusable popup container)

---

## 📁 Project Structure(“The project will only work if the files in the folder follow this specific structure.”)

```

PRAYASS/
│
├── Physics/
│   ├── Chapter 1/
│   │   ├── video1.mp4
│   │   └── notes1.pdf
│   ├── Chapter 2/
│   │   ├── video2.mp4
│   │   └── notes2.pdf
│
├── Chemistry/
│   ├── Chapter 1/
│   │   ├── video1.mp4
│   │   └── notes1.pdf
│
├── Math/
│   ├── Chapter 1/
│   │   ├── video1.mp4
│   │   └── notes1.pdf


````

---

## 💻 How It Works

### ✅ CSS-Only (Checkbox Method)
Each image is wrapped inside a `<label>` linked to a hidden `<input type="checkbox">`.  
When the image is clicked:
1. The checkbox becomes checked (`:checked` selector triggers CSS).
2. The lightbox container’s opacity changes from `0 → 1`.
3. The corresponding image is displayed in full size.
4. Same logic is for sidebar menu but in that it's initial position is -300px in starting and later it becomes 0.

### 🧩 Key Concept:
```css
#check:checked ~ #container {
  opacity: 1;
  pointer-events: auto;
}
````

### ⚠️ Limitation:

Using only CSS, **each image must have its own container** (or predefined section), since CSS cannot dynamically change the `src` attribute of an `<img>` tag.

---


## 🧩 Styling Highlights

* **Gallery Grid:** Uses `flex` for easy alignment and wrapping.
* **Hover Effect:** Slight zoom-in animation for interactivity.
* **Lightbox Overlay:** A fixed-position div covering the viewport with semi-transparent background.
* **Responsive Design:** Images scale proportionally within their container.

Example snippet:

```css
.card{
        background-color: rgba(255,255,255, 0.5);
        width: 150px;
        border-radius: 0.5rem;
        padding: 0.5rem;
        margin-left: 1.5rem;
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        transition: all 0.3s linear;
    }
    .card:hover{
        box-shadow: 0 0 8px rgba(56, 54, 54, 0.6);
        transform: scale(1.05);
    }
    .card-container{
        display: flex;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
    .card-img{
        width: 100%;
        height: 120px;
        object-fit: cover;
        display: block;
        border-radius: 0.5rem;
    }
    .card-title{
        font-weight: 600;
    }
    .photo-cards{
        margin-left: 5rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
```

---

## 🎨 Customization

You can easily adjust:

* Background color / opacity for the overlay
* Image transition duration
* Padding / margins between images
* Font style (currently uses [Poppins](https://fonts.google.com/specimen/Poppins))

---

## 🧰 Technologies Used

* **HTML5**
* **CSS3 (Flexbox + Pseudo-classes)**

---

## 🧪 Future Improvements

* Add keyboard navigation (Next / Previous)
* Add **JavaScript** (for single-popup version)
* Add smooth zoom and fade transitions
* Integrate lazy loading for performance optimization

---

## 📸 Preview

A simple representation of functionality:

| Action             | Result                          |
| ------------------ | ------------------------------- |
| Hover over image   | Slight zoom-in effect           |
| Click image        | Opens full-screen lightbox view |
| Click ❌ or outside | Closes lightbox                 |

---

## 🧑‍💻 Author

**Abhishek Verma**
Built with ❤️ using HTML & CSS only.

---

## 📄 License

This project is open-source and available under the **MIT License**.

```
