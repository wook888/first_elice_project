const { Order } = require('../data-access');

const orderService = {
    // 주문서 등록
    createOrder: async ({ orderId, userId, productId, quantity, orderDate, totalAmount }) => {
        const createdOrder = await Order.create({
            orderId,
            userId,
            productId,
            quantity,
            orderDate,
            totalAmount,
        });

        if (!createdOrder) {
            throw new Error('주문서 등록에 실패했습니다.');
        }

        // 'User'와 'Product'에 대한 참조 정보를 가져오기 위해 필요한 populate() 함수 적용
        const populatedOrder = await Order.populate(createdOrder, [
            { path: 'userId' },
            { path: 'productId' },
        ]);

        if (!populatedOrder) {
            throw new Error('주문서 정보를 가져오는 데 실패했습니다.');
        }

        // 추가된 사용자와 제품 정보와 주문에 포함해서 반환
        return populatedOrder;
    },

    // 주문서 삭제
    deleteOrder: async ({ orderId }) => {
        const deletedOrder = await Order.deleteOne({ _id: orderId });
        if (deletedOrder.ok !== 1) {
            // ok : 작업 성공시 1 할당
            throw new Error('주문서 삭제에 실패했습니다.');
        }
        return deletedOrder;
    },

    // 배송정보 수정
    updateDeliveryInfo: async ({ orderId, userId }) => {
        const updateDeliveryInfo = await Order.updateOne({ _id: orderId }, { $set: { userId } }); // $set 문서 전체를 수정하는 것이 아닌 배송 정보만 수정하도록 설정
        if (updateDeliveryInfo.nModified === 0) {
            // 수정된 문서의 수가 0개일 때
            // 배송 정보가 수정되지 않았다는 에러 메시지를 반환
            return { error: '배송 정보를 정상적으로 처리하지 못했습니다.' };
        }
        return updateDeliveryInfo;
    },
    // 배송 상태 수정
    updateDeliveryStatus: async ({ orderId, DeliveryStatus }) => {
        const updateDeliveryStatus = await Order.updateOne(
            { _id: orderId },
            { $set: { DeliveryStatus } },
            // $set 문서 전체를 수정하는 것이 아닌 배송 상태만 수정하도록 설정
        );
        if (updateDeliveryStatus.nModified === 0) {
            // 수정된 문서의 수가 0개일 때
            // 배송 상태가 수정되지 않았다는 에러 메시지를 반환
            return { error: '배송 상태를 정상적으로 처리하지 못했습니다.' };
        }
        return updateDeliveryStatus;
    },
};

module.exports = orderService;
