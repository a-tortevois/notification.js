class Notification {

    constructor() {
        if (Notification.instance instanceof Notification) {
            return Notification.instance;
        }
        Notification.instance = this;

        this.definedTypes = [Notification.ERROR, Notification.INFO, Notification.SUCCESS, Notification.WARNING];

        this.color = {
            error: 'rgb(244, 67, 54)',
            info: 'rgb(3, 169, 244)',
            success: 'rgb(76, 175, 80)',
            warning: 'rgb(255, 152, 0)',
        };

        this.svgPath = {
            error: 'M12.469.027c-3.332 0-6.465 1.301-8.824 3.653-4.86 4.86-4.86 12.777 0 17.636a12.392 12.392 0 008.824 3.653c3.336 0 6.465-1.301 8.824-3.653 4.863-4.859 4.863-12.777 0-17.636A12.417 12.417 0 0012.469.027zm5.61 18.086a1.137 1.137 0 01-.802.332c-.285 0-.582-.113-.8-.332l-4.008-4.008-4.008 4.008a1.137 1.137 0 01-.8.332c-.286 0-.583-.113-.802-.332a1.132 1.132 0 010-1.605l4.008-4.004L6.86 8.496a1.132 1.132 0 010-1.605 1.127 1.127 0 011.602 0l4.008 4.007 4.008-4.007a1.127 1.127 0 011.601 0c.45.449.45 1.164 0 1.605l-4.004 4.008 4.004 4.004c.45.449.45 1.164 0 1.605zm0 0',
            info: 'M12.504.035a12.468 12.468 0 100 24.937 12.468 12.468 0 000-24.937zM15.1 19.359c-.643.25-1.153.445-1.537.576-.384.134-.825.199-1.333.199-.775 0-1.381-.192-1.813-.57a1.832 1.832 0 01-.642-1.442c0-.227.015-.459.047-.693.03-.24.083-.504.154-.806l.802-2.835c.069-.272.132-.527.182-.77.048-.244.069-.467.069-.668 0-.36-.075-.615-.223-.756-.153-.144-.437-.213-.857-.213-.207 0-.422.036-.639.095a9.914 9.914 0 00-.56.184l.213-.874a19.777 19.777 0 011.51-.549 4.48 4.48 0 011.361-.23c.77 0 1.368.19 1.784.56a1.857 1.857 0 01.626 1.452c0 .122-.012.341-.04.652a4.44 4.44 0 01-.162.856l-.798 2.831a8.133 8.133 0 00-.176.775c-.05.288-.075.51-.075.66 0 .374.082.633.251.771.165.134.458.202.875.202.192 0 .412-.037.66-.1.243-.073.42-.127.531-.18zm-.144-11.483a1.901 1.901 0 01-1.343.518 1.93 1.93 0 01-1.352-.518 1.65 1.65 0 01-.562-1.258 1.688 1.688 0 01.562-1.266 1.914 1.914 0 011.35-.522c.524 0 .975.173 1.345.523a1.673 1.673 0 01.56 1.266 1.65 1.65 0 01-.56 1.257z',
            success: 'M12.5 0C5.602 0 0 5.602 0 12.5S5.602 25 12.5 25 25 19.398 25 12.5 19.398 0 12.5 0zm-2.3 18.898l-5.5-5.5 1.8-1.796 3.7 3.699L18.5 7l1.8 1.8zm0 0',
            warning: 'M24.585 21.17L13.774 3.24a1.51 1.51 0 00-2.586 0L.376 21.17a1.51 1.51 0 001.293 2.29h21.623a1.51 1.51 0 001.292-2.29zM12.49 8.714c.621 0 1.146.35 1.146.97 0 1.895-.223 4.618-.223 6.513 0 .494-.541.7-.923.7-.51 0-.94-.208-.94-.701 0-1.894-.223-4.617-.223-6.511 0-.62.51-.971 1.163-.971zm.015 11.734a1.225 1.225 0 01-1.225-1.226c0-.669.525-1.227 1.225-1.227.652 0 1.21.558 1.21 1.227 0 .652-.557 1.225-1.21 1.225z',
        };

        this.notificationContainer = document.createElement('div');
        this.notificationContainer.setAttribute("id", "notification-container");
        this.notificationContainer.classList.add('notification-container');

        this.parentNodeId = null;

        return this;
    }

    destroy() {
        if (this.parentNodeId !== null) {
            document.querySelector(this.parentNodeId).removeChild(this.notificationContainer);
            this.parentNodeId = null;
        }
        // Delete object attributes
        Object.keys(this).forEach(key => {
            delete this[key];
        });
        // Clear singleton instance
        Notification.instance = null;
    }

    appendTo(parentNodeId) {
        if (this.parentNodeId !== null) {
            document.querySelector(this.parentNodeId).removeChild(this.notificationContainer);
        }
        this.parentNodeId = parentNodeId;
        document.querySelector(this.parentNodeId).appendChild(this.notificationContainer);
        return this;
    }

    add(type, text, duration = null) {
        if (this.parentNodeId === null) {
            console.error(`ParentNodeId is not defined`);
            return undefined;
        }
        if (!this.definedTypes.includes(type)) {
            console.error(`Type of Notification '${type}' is not defined`);
            return undefined;
        }
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // icon.classList.add('notification-icon');
        icon.setAttribute('viewBox', '0 0 25 25');
        icon.setAttribute('width', '25');
        icon.setAttribute('height', '25');

        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconPath.setAttribute('fill', this.color[type]);
        iconPath.setAttribute('d', this.svgPath[type]);

        icon.appendChild(iconPath);

        const notification = document.createElement('div');
        notification.appendChild(icon);
        notification.classList.add('notification', `notification-${type}`, 'notification-fadeIn');
        notification.innerHTML += `<span>${text}</span>`;
        // add the notification to the container
        this.notificationContainer.appendChild(notification);
        if (duration !== null) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        return notification;
    }

    remove(notification) {
        notification.classList.replace("notification-fadeIn", "notification-fadeOut");
        // remove notification from the DOM after 0.5 seconds
        setTimeout(() => {
            this.notificationContainer.removeChild(notification);
        }, 500);
    }
}

Notification.ERROR = 'error';
Notification.INFO = 'info';
Notification.SUCCESS = 'success';
Notification.WARNING = 'warning';